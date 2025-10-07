import { input } from '@inquirer/prompts';
import { editAsset } from "../../Assets/commands/editAsset.js";
import { getAsset } from "../../Assets/commands/getAsset.js";
import { SingleAssetType } from '../../Assets/types/assetTypes.js';

export async function changeFile(fileName: string, fileType: SingleAssetType) {
    const newLogoPath = await input({
        message: '📂 Enter the path to the new logo file:',
        validate: (value) => value ? true : 'Path cannot be empty'
    });

    const logoUUID = await getAsset(fileName, fileType);

    if (logoUUID) {
        await editAsset({
            assetUUID: logoUUID,
            assetSrc: newLogoPath,
            skipPrompts: true,
        });
        console.log('✅ Logo updated successfully!');
    } else {
        console.error('❌ Logo asset not found');
    }
}
