import { input, select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { open } from 'node:fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import { NewAssetOptions, AssetData, SingleAssetType, FontAsset, ImageAsset, PdfAsset, VideoAsset } from '../types/assetTypes.js';
import { createGUID } from '../../../shared/utils/createGUID.js';

const execAsync = promisify(exec);

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

export async function newAsset(options?: NewAssetOptions): Promise<string | undefined> {
  const {
    assetType: optAssetType,
    assetName: optAssetName,
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

  const assetType = skipPrompts && optAssetType ? optAssetType : await select({
    message: 'Select asset type:',
    choices: [
      { name: 'Font', value: 'font' as SingleAssetType },
      { name: 'Image', value: 'image' as SingleAssetType },
      { name: 'PDF', value: 'pdf' as SingleAssetType },
      { name: 'Video', value: 'video' as SingleAssetType }
    ]
  });

  const assetKey = getAssetKey(assetType);
  const existingAssets = assets[assetKey] as Array<FontAsset | ImageAsset | PdfAsset | VideoAsset>;

  const assetName = skipPrompts && optAssetName ? optAssetName : await input({
    message: 'Enter the asset name:',
    validate: (input: string) => {
      if (!input) return 'Asset name is required';
      const nameKey = `${assetType}Name` as keyof (FontAsset | ImageAsset | PdfAsset | VideoAsset);
      if (existingAssets.some((a) => a[nameKey] === input)) {
        return 'Asset name already exists';
      }
      return true;
    }
  });

  let filePath: string;
  if (skipPrompts && optAssetSrc) {
    filePath = optAssetSrc;
    try {
      await fs.access(filePath);
    } catch {
      console.error(`❌ File not found: ${filePath}`);
      return undefined;
    }
  } else {
    const selectedPath = await openFileExplorer();
    if (!selectedPath) {
      console.error('❌ No file selected');
      return undefined;
    }
    filePath = selectedPath;
  }

  const fileExtension = path.extname(filePath).toLowerCase();
  const validExtensions = ASSET_EXTENSIONS[assetType];
  
  if (!validExtensions.includes(fileExtension)) {
    console.error(`❌ Invalid file type. Expected: ${validExtensions.join(', ')}`);
    return undefined;
  }

  const destinationFolder = path.resolve(process.cwd(), 'src/assets', ASSET_FOLDERS[assetType]);
  const destinationFileName = `${assetName}${fileExtension}`;
  const destinationPath = path.join(destinationFolder, destinationFileName);

  try {
    await fs.mkdir(destinationFolder, { recursive: true });
    await fs.copyFile(filePath, destinationPath);
    console.log(`✅ File copied to: ${destinationPath}`);
  } catch (error) {
    console.error('❌ Error copying file:', error);
    return undefined;
  }

  const assetUUID = createGUID();
  const relativePath = `assets/${ASSET_FOLDERS[assetType]}/${destinationFileName}`;

  let newAsset: FontAsset | ImageAsset | PdfAsset | VideoAsset;

  switch (assetType) {
    case 'font':
      newAsset = {
        fontName: assetName,
        fontSrc: relativePath,
        fontUUID: assetUUID,
        fontDeletable: true
      } as FontAsset;
      break;
    case 'image':
      newAsset = {
        imageName: assetName,
        imageSrc: relativePath,
        imageUUID: assetUUID,
        imageDeletable: true
      } as ImageAsset;
      break;
    case 'pdf':
      newAsset = {
        pdfName: assetName,
        pdfSrc: relativePath,
        pdfUUID: assetUUID,
        pdfDeletable: true
      } as PdfAsset;
      break;
    case 'video':
      newAsset = {
        videoName: assetName,
        videoSrc: relativePath,
        videoUUID: assetUUID,
        videoDeletable: true
      } as VideoAsset;
      break;
  }

  (assets[assetKey] as Array<typeof newAsset>).push(newAsset);

  try {
    const formattedAssets = await prettier.format(JSON.stringify(assets), { parser: 'json' });
    await fs.writeFile(assetsJsonPath, formattedAssets, 'utf-8');
    console.log(`✅ Asset "${assetName}" added to assets.json`);
  } catch {
    console.error('❌ Error writing to assets.json');
    return undefined;
  }

  return assetUUID;
}