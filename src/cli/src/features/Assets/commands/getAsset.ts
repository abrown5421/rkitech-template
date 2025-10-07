import fs from 'fs/promises';
import path from 'path';
import { AssetData, SingleAssetType } from '../types/assetTypes.js';

export async function getAsset(assetName: string, dir?: SingleAssetType): Promise<string | undefined> {
  if (!assetName) return undefined;

  const assetsJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Assets/json/assets.json');

  let assets: AssetData;
  try {
    const assetsRaw = await fs.readFile(assetsJsonPath, 'utf-8');
    assets = JSON.parse(assetsRaw);
  } catch {
    console.error(`❌ Could not read or parse assets.json at: ${assetsJsonPath}`);
    return undefined;
  }

  const getKey = (type: SingleAssetType, suffix: 'Name' | 'UUID') => `${type}${suffix}`;

  const categories = dir ? [dir] : (Object.keys(assets) as SingleAssetType[]);

  for (const category of categories) {
    const items = assets[`${category}s` as keyof AssetData] as any[];
    const found = items.find(item => item[getKey(category, 'Name')] === assetName);
    if (found) {
      return found[getKey(category, 'UUID')];
    }
  }

  console.warn(`⚠️ Asset "${assetName}"${dir ? ` in ${dir}` : ''} not found`);
  return undefined;
}
