import { input, select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { EditAssetOptions, AssetData, SingleAssetType, FontAsset, ImageAsset, PdfAsset, VideoAsset } from '../types/assetTypes.js';

const ASSET_FOLDERS: Record<SingleAssetType, string> = {
  font: 'fonts',
  image: 'images',
  pdf: 'pdfs',
  video: 'videos'
};

const ASSET_EXTENSIONS: Record<SingleAssetType, string[]> = {
  font: ['.ttf', '.otf', '.woff', '.woff2'],
  image: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
  pdf: ['.pdf'],
  video: ['.mp4', '.webm', '.mov', '.avi']
};

async function openFileExplorer(): Promise<string | null> {
  console.log('\n📂 Opening file explorer...');
  console.log('Please select a file and press Enter when done.');
  
  const filePath = await input({
    message: 'Paste the full path to the file:',
    validate: async (input: string) => {
      if (!input) return 'File path is required';
      try {
        await fs.access(input);
        return true;
      } catch {
        return 'File not found. Please provide a valid file path.';
      }
    }
  });

  return filePath;
}

function getAssetKey(assetType: SingleAssetType): keyof AssetData {
  const keyMap: Record<SingleAssetType, keyof AssetData> = {
    font: 'fonts',
    image: 'images',
    pdf: 'pdfs',
    video: 'videos'
  };
  return keyMap[assetType];
}

function getAssetType(assets: AssetData, uuid: string): SingleAssetType | null {
  if (assets.fonts.some(a => a.fontUUID === uuid)) return 'font';
  if (assets.images.some(a => a.imageUUID === uuid)) return 'image';
  if (assets.pdfs.some(a => a.pdfUUID === uuid)) return 'pdf';
  if (assets.videos.some(a => a.videoUUID === uuid)) return 'video';
  return null;
}

export async function editAsset(options?: EditAssetOptions): Promise<string | undefined> {
  const {
    assetUUID: optAssetUUID,
    assetSrc: optAssetSrc,
    skipPrompts
  } = options || {};

  const assetsJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Assets/json/assets.json');

  try {
    await fs.access(assetsJsonPath);
  } catch {
    console.error(`❌ Could not find assets.json at: ${assetsJsonPath}`);
    return undefined;
  }

  let assets: AssetData;
  try {
    const assetsRaw = await fs.readFile(assetsJsonPath, 'utf-8');
    assets = JSON.parse(assetsRaw);
  } catch {
    console.error('❌ Error reading or parsing assets.json');
    return undefined;
  }

  const allAssets = [
    ...assets.fonts.map(a => ({ ...a, type: 'font' as SingleAssetType, name: a.fontName, uuid: a.fontUUID })),
    ...assets.images.map(a => ({ ...a, type: 'image' as SingleAssetType, name: a.imageName, uuid: a.imageUUID })),
    ...assets.pdfs.map(a => ({ ...a, type: 'pdf' as SingleAssetType, name: a.pdfName, uuid: a.pdfUUID })),
    ...assets.videos.map(a => ({ ...a, type: 'video' as SingleAssetType, name: a.videoName, uuid: a.videoUUID }))
  ];

  if (allAssets.length === 0) {
    console.log('❌ No assets found to edit.');
    return undefined;
  }

  const assetUUID = skipPrompts && optAssetUUID ? optAssetUUID : await select({
    message: 'Select an asset to edit:',
    choices: allAssets.map(asset => ({
      name: `${asset.name} (${asset.type})`,
      value: asset.uuid
    }))
  });

  const selectedAssetInfo = allAssets.find(a => a.uuid === assetUUID);
  if (!selectedAssetInfo) {
    console.error('❌ Selected asset not found.');
    return undefined;
  }

  const assetType = selectedAssetInfo.type;
  const assetKey = getAssetKey(assetType);
  const assetArray = assets[assetKey] as Array<FontAsset | ImageAsset | PdfAsset | VideoAsset>;
  
  const uuidKey = `${assetType}UUID` as keyof (FontAsset | ImageAsset | PdfAsset | VideoAsset);
  const srcKey = `${assetType}Src` as keyof (FontAsset | ImageAsset | PdfAsset | VideoAsset);
  const nameKey = `${assetType}Name` as keyof (FontAsset | ImageAsset | PdfAsset | VideoAsset);
  
  const assetIndex = assetArray.findIndex(a => a[uuidKey] === assetUUID);
  if (assetIndex === -1) {
    console.error('❌ Asset not found in collection.');
    return undefined;
  }

  const currentAsset = assetArray[assetIndex];
  const currentSrc = currentAsset[srcKey] as string;
  const assetName = currentAsset[nameKey] as string;

  let newFilePath: string;
  if (skipPrompts && optAssetSrc) {
    newFilePath = optAssetSrc;
    try {
      await fs.access(newFilePath);
    } catch {
      console.error(`❌ File not found: ${newFilePath}`);
      return undefined;
    }
  } else {
    const selectedPath = await openFileExplorer();
    if (!selectedPath) {
      console.error('❌ No file selected');
      return undefined;
    }
    newFilePath = selectedPath;
  }

  const fileExtension = path.extname(newFilePath).toLowerCase();
  const validExtensions = ASSET_EXTENSIONS[assetType];
  
  if (!validExtensions.includes(fileExtension)) {
    console.error(`❌ Invalid file type. Expected: ${validExtensions.join(', ')}`);
    return undefined;
  }

  const oldFilePath = path.resolve(process.cwd(), 'src', currentSrc);
  try {
    await fs.access(oldFilePath);
    await fs.unlink(oldFilePath);
    console.log(`🗑️ Removed old file: ${oldFilePath}`);
  } catch {
    console.warn(`⚠️ Could not find or remove old file: ${oldFilePath}`);
  }

  const destinationFolder = path.resolve(process.cwd(), 'src/assets', ASSET_FOLDERS[assetType]);
  const destinationFileName = `${assetName}${fileExtension}`;
  const destinationPath = path.join(destinationFolder, destinationFileName);

  try {
    await fs.mkdir(destinationFolder, { recursive: true });
    await fs.copyFile(newFilePath, destinationPath);
    console.log(`✅ New file copied to: ${destinationPath}`);
  } catch (error) {
    console.error('❌ Error copying file:', error);
    return undefined;
  }

  const newRelativePath = `assets/${ASSET_FOLDERS[assetType]}/${destinationFileName}`;
  (currentAsset as any)[srcKey] = newRelativePath;

  try {
    const formattedAssets = await prettier.format(JSON.stringify(assets), { parser: 'json' });
    await fs.writeFile(assetsJsonPath, formattedAssets, 'utf-8');
    console.log(`✅ Asset "${assetName}" updated in assets.json`);
  } catch {
    console.error('❌ Error writing to assets.json');
    return undefined;
  }

  return assetUUID;
}