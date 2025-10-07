import path from "path";
import fs from 'fs/promises';
import { select, confirm } from '@inquirer/prompts';
import { AuthConfig } from "../types/authTypes.js";
import { newPage } from "../../Pages/commands/newPage.js";
import { PageData } from "../../Pages/types/pageTypes.js";
import { TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components";
import { COLORS, INTENSITIES, THEME_COLORS } from "../../../shared/constants/tailwindConstants.js";
import { newMenuItem } from "../../Navbar/commands/newMenuItem.js";

export async function initAuth(mode: "manage" | "new") {
    const authJsonPath = path.resolve(
        process.cwd(),
        'src/cli/src/features/Auth/json/auth.json'
    );

    try {
        await fs.access(authJsonPath);
    } catch (error) {
        console.error(`❌ Could not find auth.json at: ${authJsonPath}`);
        console.log('Please ensure the auth.json file exists in the correct location.');
        return;
    }
    
    let auth: AuthConfig;
    let pageColor: TailwindColor | ThemeOptions;
    let pageIntensity: TailwindIntensity | false;

    try {
        const authRaw = await fs.readFile(authJsonPath, 'utf-8');
        auth = JSON.parse(authRaw);
    } catch (error) {
        console.error('❌ Error reading or parsing auth.json:', error);
        return;
    }
    
    if (mode === "new") {
        auth.authActive = true;
    
        const authPageID = await newPage({
            pageName: 'Login',
            pagePath: 'login',
            pageRenderMethod: 'static',
            pageActive: true,
            pageColor: 'black',
            pageIntensity: false,
            pageEntranceAnimation: 'animate__slideInUp',
            pageExitAnimation: 'animate__slideOutDown',
            chosenTemplate: 'Auth',
            skipPrompts: true
        });

        await newMenuItem({
            itemName: 'Login',
            itemType: 'page',
            itemID: authPageID || '', 
            itemColor: 'black',
            itemIntensity: false,
            itemHoverColor: 'primary',
            itemHoverIntensity: false,
            itemActiveColor: 'primary',
            itemActiveIntensity: false,
            itemEntranceAnimation: 'animate__fadeIn',
            itemExitAnimation: 'animate__fadeOut',
            syncWithFooter: true,
            skipPrompts: true
        });

        try {
            await fs.writeFile(authJsonPath, JSON.stringify(auth, null, 2), 'utf-8');
            console.log('✅ Auth created and auth.json updated successfully!');
        } catch (writeError) {
            console.error('❌ Error writing to auth.json:', writeError);
        }
    }
}
