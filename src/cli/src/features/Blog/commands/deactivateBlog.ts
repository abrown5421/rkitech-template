import path from "path";
import fs from 'fs/promises';
import { BlogConfig } from "../types/blogTypes.js";
import { confirm } from '@inquirer/prompts';
import { PageData } from "../../Pages/types/pageTypes.js";
import { deletePage } from "../../Pages/commands/deletePage.js";

export async function deactivateBlog() {
    const blogJsonPath = path.resolve(
        process.cwd(),
        'src/cli/src/features/Blog/json/blog.json'
    );

    try {
        await fs.access(blogJsonPath);
    } catch (error) {
        console.error(`❌ Could not find blog.json at: ${blogJsonPath}`);
        console.log('Please ensure the blog.json file exists in the correct location.');
        return;
    }
    
    const pagesJsonPath = path.resolve(
        process.cwd(), 
        'src/cli/src/features/Pages/json/pages.json'
    );

    try {
        await fs.access(pagesJsonPath);
    } catch (error) {
        console.error(`❌ Could not find blog.json at: ${pagesJsonPath}`);
        console.log('Please ensure the pages.json file exists in the correct location.');
        return;
    }
    
    let blog: BlogConfig;

    try {
        const blogRaw = await fs.readFile(blogJsonPath, 'utf-8');
        blog = JSON.parse(blogRaw);
    } catch (error) {
        console.error('❌ Error reading or parsing blog.json:', error);
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
       
    blog.blogActive = false;
    const blogPage = pages.find((p) => p.pageName === 'Blog');
    const blogPostPage = pages.find((p) => p.pageName === 'BlogPost');

    const confirmed = await confirm({
        message: "⚠️  This will delete the Blog and BlogPost pages. Are you sure?",
        default: false
    });

    if (!confirmed) {
        console.log("❌ Deletion aborted by user.");
        return;
    }

    if (blogPage?.pageID) {
        await deletePage({
            pageID: blogPage.pageID,
            skipPrompts: true
        });
    }

    if (blogPostPage?.pageID) {
        await deletePage({
            pageID: blogPostPage.pageID,
            skipPrompts: true
        });
    }

    try {
        await fs.writeFile(
            blogJsonPath, 
            JSON.stringify(blog, null, 2), 
            'utf-8'
        );
        console.log('✅ Blog configuration saved successfully!');
    } catch (error) {
        console.error('❌ Error writing blog.json:', error);
        return;
    }
}
