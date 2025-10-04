import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { DeleteAssetOptions, AssetData, SingleAssetType, FontAsset, ImageAsset, PdfAsset, VideoAsset } from '../types/assetTypes.js';

function getAssetKey(assetType: SingleAssetType): keyof AssetData {
  const keyMap: Record<SingleAssetType, keyof AssetData> = {
    font: 'fonts',
    image: 'images',
    pdf: 'pdfs',
    video: 'videos'
  };
  return keyMap[assetType];
}

export async function deleteAsset(options?: DeleteAssetOptions): Promise<boolean> {
  const {
    assetUUID: optAssetUUID,
    skipPrompts
  } = options || {};

  const assetsJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Assets/json/assets.json');

  try {
    await fs.access(assetsJsonPath);
  } catch {
    console.error(`❌ Could not find assets.json at: ${assetsJsonPath}`);
    return false;
  }

  let assets: AssetData;
  try {
    const assetsRaw = await fs.readFile(assetsJsonPath, 'utf-8');
    assets = JSON.parse(assetsRaw);
  } catch {
    console.error('❌ Error reading or parsing assets.json');
    return false;
  }

  const allAssets = [
    ...assets.fonts.map(a => ({ 
      ...a, 
      type: 'font' as SingleAssetType, 
      name: a.fontName, 
      uuid: a.fontUUID,
      deletable: a.fontDeletable,
      src: a.fontSrc 
    })),
    ...assets.images.map(a => ({ 
      ...a, 
      type: 'image' as SingleAssetType, 
      name: a.imageName, 
      uuid: a.imageUUID,
      deletable: a.imageDeletable,
      src: a.imageSrc 
    })),
    ...assets.pdfs.map(a => ({ 
      ...a, 
      type: 'pdf' as SingleAssetType, 
      name: a.pdfName, 
      uuid: a.pdfUUID,
      deletable: a.pdfDeletable,
      src: a.pdfSrc 
    })),
    ...assets.videos.map(a => ({ 
      ...a, 
      type: 'video' as SingleAssetType, 
      name: a.videoName, 
      uuid: a.videoUUID,
      deletable: a.videoDeletable,
      src: a.videoSrc 
    }))
  ];

  if (allAssets.length === 0) {
    console.log('❌ No assets found to delete.');
    return false;
  }

  const assetUUID = skipPrompts && optAssetUUID ? optAssetUUID : await select({
    message: 'Select an asset to delete:',
    choices: allAssets.map(asset => ({
      name: `${asset.name} (${asset.type})${!asset.deletable ? ' - PROTECTED' : ''}`,
      value: asset.uuid
    }))
  });

  const selectedAssetInfo = allAssets.find(a => a.uuid === assetUUID);
  if (!selectedAssetInfo) {
    console.error('❌ Selected asset not found.');
    return false;
  }

  if (!selectedAssetInfo.deletable) {
    console.error(`❌ Asset "${selectedAssetInfo.name}" is protected and cannot be deleted.`);
    return false;
  }

  const confirmDelete = skipPrompts ? true : await confirm({
    message: `Are you sure you want to delete "${selectedAssetInfo.name}"? This action cannot be undone.`,
    default: false
  });

  if (!confirmDelete) {
    console.log('❌ Deletion cancelled.');
    return false;
  }

  const assetType = selectedAssetInfo.type;
  const assetKey = getAssetKey(assetType);
  const assetArray = assets[assetKey] as Array<FontAsset | ImageAsset | PdfAsset | VideoAsset>;
  
  const uuidKey = `${assetType}UUID` as keyof (FontAsset | ImageAsset | PdfAsset | VideoAsset);
  const srcKey = `${assetType}Src` as keyof (FontAsset | ImageAsset | PdfAsset | VideoAsset);
  
  const assetToDelete = assetArray.find(a => a[uuidKey] === assetUUID);
  if (!assetToDelete) {
    console.error('❌ Asset not found in collection.');
    return false;
  }

  const filePath = path.resolve(process.cwd(), 'src', assetToDelete[srcKey] as string);
  
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    console.log(`✅ Deleted file: ${filePath}`);
  } catch {
    console.warn(`⚠️ Could not find or delete file: ${filePath}`);
  }

  const filteredAssets = assetArray.filter(a => a[uuidKey] !== assetUUID);
  (assets as any)[assetKey] = filteredAssets;

  try {
    const formattedAssets = await prettier.format(JSON.stringify(assets), { parser: 'json' });
    await fs.writeFile(assetsJsonPath, formattedAssets, 'utf-8');
    console.log(`✅ Asset "${selectedAssetInfo.name}" removed from assets.json`);
  } catch {
    console.error('❌ Error writing to assets.json');
    return false;
  }

  console.log(`✅ Successfully deleted asset "${selectedAssetInfo.name}".`);
  return true;
}