import { input, select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../../Pages/types/pageTypes.js';
import { COLORS, INTENSITIES } from '../../../shared/constants/tailwindConstants.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { createGUID } from '../../../shared/utils/createGUID.js';
import { Navbar } from '../types/navTypes.js';
import { NavItem } from '../../../shared/types/navItemTypes.js';

export async function newMenuItem() {
  const navbarJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Navbar/json/navbar.json'
  );

  const pagesJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Pages/json/pages.json'
  );

  try {
    await fs.access(navbarJsonPath);
  } catch (error) {
    console.error(`❌ Could not find navbar.json at: ${navbarJsonPath}`);
    console.log('Please ensure the navbar.json file exists in the correct location.');
    return;
  }

  let navbar: Navbar;
  try {
    const navbarRaw = await fs.readFile(navbarJsonPath, 'utf-8');
    navbar = JSON.parse(navbarRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing navbar.json:', error);
    return;
  }

  let pages: PageData[] = [];
  try {
    await fs.access(pagesJsonPath);
    const pagesRaw = await fs.readFile(pagesJsonPath, 'utf-8');
    pages = JSON.parse(pagesRaw);
  } catch (error) {
    console.error('❌ Error reading pages.json:', error);
    return;
  }

  const itemName = await input({
    message: 'Enter the menu item name:',
    validate: (input: string) => {
      if (!input) return 'Menu item name is required';
      if (navbar.navbarMenuItems.some((item) => item.itemName === input)) {
        return 'Menu item name already exists';
      }
      return true;
    },
  });

  const itemType = await select({
    message: 'Select menu item type:',
    choices: [
      { name: 'page', value: 'page' },
      { name: 'link', value: 'link' },
    ],
  });

  let itemID = '';
  let itemLink = '';

  if (itemType === 'page') {
    const activePages = pages.filter((page) => page.pageActive);
    
    if (activePages.length === 0) {
      console.log('❌ No active pages found. Please create and activate a page first.');
      return;
    }

    itemID = await select({
      message: 'Select a page to link to:',
      choices: activePages.map((page) => ({
        name: `${page.pageName} (${page.pagePath})`,
        value: page.pageID,
      })),
    });
  } else {
    itemLink = await input({
      message: 'Enter the external link URL:',
      validate: (input: string) => {
        if (!input) return 'Link URL is required';
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      },
    });
    itemID = createGUID();
  }

  const itemColor = await select({
    message: 'Select item color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
  });

  const itemIntensity = await select({
    message: 'Select item intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
  });

  const itemHoverColor = await select({
    message: 'Select item hover color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
  });

  const itemHoverIntensity = await select({
    message: 'Select item hover intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
  });

  const itemActiveColor = await select({
    message: 'Select item active color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
  });

  const itemActiveIntensity = await select({
    message: 'Select item active intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
  });

  const itemEntranceAnimation = await select({
    message: 'Select entrance animation:',
    choices: ENTRANCE_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
  });

  const itemExitAnimation = await select({
    message: 'Select exit animation:',
    choices: EXIT_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
  });

  const newMenuItem: NavItem = {
    itemName,
    itemType: itemType as 'page' | 'link',
    itemID,
    itemColor,
    itemIntensity,
    itemHoverColor,
    itemHoverIntensity,
    itemActiveColor,
    itemActiveIntensity,
    itemEntranceAnimation,
    itemExitAnimation,
    ...(itemType === 'link' && { itemLink }),
  };

  navbar.navbarMenuItems.push(newMenuItem);

  try {
    const formattedNavbar = await prettier.format(JSON.stringify(navbar), {
      parser: 'json',
    });
    await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
    console.log(`✅ Menu item "${newMenuItem.itemName}" added to navbar`);
  } catch (error) {
    console.error('❌ Error writing to navbar.json:', error);
  }
}