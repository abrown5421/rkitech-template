import path from "path";
import fs from 'fs/promises';
import { BlogConfig } from "../types/blogTypes.js";
import { input, number, confirm } from '@inquirer/prompts';
import { newPage } from "../../Pages/commands/newPage.js";
import { newMenuItem } from "../../Navbar/commands/newMenuItem.js";

export async function initBlog(mode: "manage" | "new") {
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
    
    let blog: BlogConfig;

    try {
        const blogRaw = await fs.readFile(blogJsonPath, 'utf-8');
        blog = JSON.parse(blogRaw);
    } catch (error) {
        console.error('❌ Error reading or parsing blog.json:', error);
        return;
    }
    
    if (mode === "new") {
        blog.blogActive = true;
    }

    const blogTitle = await input({
        message: 'Enter the blog title:',
        default: blog.blogTitle
    });

    const postsPerPage = await number({
        message: "Enter the number of posts per page:",
        default: blog.postsPerPage as number,
        validate: (input) => {
            const value = Number(input);
            if (isNaN(value)) return "Please enter a valid number.";
            if (!Number.isInteger(value)) return "Please enter a whole number.";
            if (value <= 0) return "Posts per page must be a positive number.";
            return true;
        },
    });
    
    const postsPerRow = await number({
        message: "Enter the number of posts per row:",
        default: blog.postsPerRow,
        validate: (input) => {
            const value = Number(input);
            if (isNaN(value)) return "Please enter a valid number.";
            if (!Number.isInteger(value)) return "Please enter a whole number.";
            if (value <= 0) return "Posts per page must be a positive number.";
            if (value >= 7) return "Posts per page must be between 1 and 6.";
            return true;
        },
    });

    const postSorter = await confirm({
        message: "Do you want to include a date sorter/alphabetizer?",
        default: blog.postSorter
    });

    const postCategoryFilter = await confirm({
        message: "Do you want to allow for sorting by category?",
        default: blog.postCategoryFilter
    });

    blog.blogTitle = blogTitle;
    blog.postsPerPage = postsPerPage as number;
    blog.postsPerRow = postsPerRow as number;
    blog.postSorter = postSorter;
    blog.postCategoryFilter = postCategoryFilter;

    if (mode === "new") {
        const blogPageID = await newPage({
            pageName: 'Blog',
            pagePath: 'blog',
            pageRenderMethod: 'static',
            pageActive: true,
            pageColor: 'white',
            pageIntensity: false,
            pageEntranceAnimation: 'animate__fadeIn',
            pageExitAnimation: 'animate__fadeOut',
            chosenTemplate: 'Blog',
            skipPrompts: true
        });

        await newPage({
            pageName: 'BlogPost',
            pagePath: 'blog/:postID',
            pageRenderMethod: 'static',
            pageActive: true,
            pageColor: 'white',
            pageIntensity: false,
            pageEntranceAnimation: 'animate__fadeIn',
            pageExitAnimation: 'animate__fadeOut',
            chosenTemplate: 'Blog Post',
            skipPrompts: true
        });

        await newMenuItem({
            itemName: 'Blog',
            itemType: 'page',
            itemID: blogPageID || '', 
            itemStyle: 'string',
            itemOrder: 4,
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