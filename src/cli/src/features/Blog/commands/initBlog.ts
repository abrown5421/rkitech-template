import path from "path";
import fs from 'fs/promises';
import { BlogConfig } from "../types/blogTypes.js";
import { input, number, select, confirm } from '@inquirer/prompts';
import { TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components";
import { COLORS, INTENSITIES, THEME_COLORS } from "../../../shared/constants/tailwindConstants.js";
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from "../../../shared/constants/animationConstants.js";
import { PageData } from "../../Pages/types/pageTypes.js";
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
    let pageColor: TailwindColor | ThemeOptions;
    let pageIntensity: TailwindIntensity | false;

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
        const pagesJsonPath = path.resolve(
            process.cwd(),
            'src/cli/src/features/Pages/json/pages.json'
        );

        try {
            await fs.access(pagesJsonPath);
        } catch (error) {
            console.error(`❌ Could not find pages.json at: ${pagesJsonPath}`);
            console.log('Please ensure the pages.json file exists in the correct location.');
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

        const pageActive = await confirm({
            message: 'Should the blog be active?',
            default: true,
        });
        
        const colorType = await select({
            message: 'Select blog page background color type:',
            choices: [
                { name: 'Tailwind Color', value: 'tailwind' },
                { name: 'Theme Color', value: 'theme' }
            ],
        });
    
        if (colorType === 'tailwind') {
            pageColor = await select({
                message: 'Select a Tailwind background color:',
                choices: COLORS.map((color) => ({ name: color, value: color })),
            });
        
            pageIntensity = await select({
                message: 'Select a page background intensity:',
                choices: INTENSITIES.map((intensity) => ({
                name: intensity.toString(),
                value: intensity,
                })),
            });
        } else {
            pageColor = await select({
                message: 'Select a theme background color:',
                choices: THEME_COLORS.map((color) => ({ name: color, value: color })),
            });
            
            pageIntensity = false; 
        }
    
        const pageEntranceAnimation = await select({
            message: 'Select entrance blog page animation:',
            choices: ENTRANCE_ANIMATIONS.map((animation) => ({
                name: animation,
                value: animation,
            })),
        }); 
    
        const pageExitAnimation = await select({
            message: 'Select exit blog page animation:',
            choices: EXIT_ANIMATIONS.map((animation) => ({
                name: animation,
                value: animation,
            })),
        });

        const blogPageID = await newPage({
            pageName: 'Blog',
            pagePath: 'blog',
            pageRenderMethod: 'static',
            pageActive: pageActive,
            pageColor: pageColor,
            pageIntensity: pageIntensity,
            pageEntranceAnimation: pageEntranceAnimation,
            pageExitAnimation: pageExitAnimation,
            chosenTemplate: 'Blog',
            skipPrompts: true
        });

        await newPage({
            pageName: 'BlogPost',
            pagePath: 'blog/:postID',
            pageRenderMethod: 'static',
            pageActive: pageActive,
            pageColor: pageColor,
            pageIntensity: pageIntensity,
            pageEntranceAnimation: pageEntranceAnimation,
            pageExitAnimation: pageExitAnimation,
            chosenTemplate: 'Blog Post',
            skipPrompts: true
        });

        await newMenuItem({
            itemName: 'Blog',
            itemType: 'page',
            itemID: blogPageID || '', 
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