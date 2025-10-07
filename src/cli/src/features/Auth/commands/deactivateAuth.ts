import path from "path";
import fs from 'fs/promises';
import { confirm } from '@inquirer/prompts';
import { AuthConfig } from "../types/authTypes.js";
import { PageData } from "../../Pages/types/pageTypes.js";
import { deletePage } from "../../Pages/commands/deletePage.js";

export async function deactivateAuth() {
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
    
    const pagesJsonPath = path.resolve(
        process.cwd(), 
        'src/cli/src/features/Pages/json/pages.json'
    );

    try {
        await fs.access(pagesJsonPath);
    } catch (error) {
        console.error(`❌ Could not find auth.json at: ${pagesJsonPath}`);
        console.log('Please ensure the pages.json file exists in the correct location.');
        return;
    }

    let auth: AuthConfig;

    try {
        const authRaw = await fs.readFile(authJsonPath, 'utf-8');
        auth = JSON.parse(authRaw);
    } catch (error) {
        console.error('❌ Error reading or parsing auth.json:', error);
        return;
    }
    
    let pages: PageData[];
        
    try {
        const pagesRaw = await fs.readFile(pagesJsonPath, 'utf-8');
        pages = JSON.parse(pagesRaw);
    } catch (error) {
        console.error('❌ Error reading or parsing pages.json:', error);
        return;
    }

    auth.authActive = false;
    const authPage = pages.find((p) => p.pageName === 'Login');

    const confirmed = await confirm({
        message: "⚠️  This will delete the Auth pages. Are you sure?",
        default: false
    });

    if (!confirmed) {
        console.log("❌ Deletion aborted by user.");
        return;
    }

    if (authPage?.pageID) {
        await deletePage({
            pageID: authPage.pageID,
            skipPrompts: true
        });
    }

    try {
        await fs.writeFile(authJsonPath, JSON.stringify(auth, null, 2), 'utf-8');
        console.log('✅ Auth deactivated and auth.json updated successfully!');
    } catch (writeError) {
        console.error('❌ Error writing to auth.json:', writeError);
    }
    
}
