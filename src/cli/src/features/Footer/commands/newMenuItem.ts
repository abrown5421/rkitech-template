import { input, select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../../Pages/types/pageTypes.js';
import { COLORS, INTENSITIES } from '../../../shared/constants/tailwindConstants.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { createGUID } from '../../../shared/utils/createGUID.js';
import { Footer } from '../types/footerTypes.js';
import { Navbar } from '../../Navbar/types/navTypes.js';
import { NavItem } from '../../../shared/types/navItemTypes.js';

export async function newMenuItem(source: "main" | "aux") {
  const footerJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Footer/json/footer.json'
  );

  const navbarJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Navbar/json/navbar.json'
  );

  const pagesJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Pages/json/pages.json'
  );

  const menuTypeName = source === "main" ? "Primary" : "Auxiliary";
  const menuArrayKey = source === "main" ? "footerPrimaryMenuItems" : "footerAuxilaryMenuItems";

  try {
    await fs.access(footerJsonPath);
  } catch (error) {
    console.error(`❌ Could not find footer.json at: ${footerJsonPath}`);
    console.log('Please ensure the footer.json file exists in the correct location.');
    return;
  }

  let footer: Footer;
  try {
    const footerRaw = await fs.readFile(footerJsonPath, 'utf-8');
    footer = JSON.parse(footerRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing footer.json:', error);
    return;
  }

  let navbar: Navbar | null = null;
  let navbarExists = false;
  if (source === "main") {
    try {
      await fs.access(navbarJsonPath);
      const navbarRaw = await fs.readFile(navbarJsonPath, 'utf-8');
      navbar = JSON.parse(navbarRaw);
      navbarExists = true;
    } catch (error) {
      console.warn('⚠️ Navbar.json not found - skipping navbar synchronization');
    }
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

  console.log(`\n🔧 Adding new menu item to ${menuTypeName} Footer Menu\n`);

  const itemName = await input({
    message: 'Enter the menu item name:',
    validate: (input: string) => {
      if (!input) return 'Menu item name is required';
      if (footer[menuArrayKey].some((item) => item.itemName === input)) {
        return `Menu item name already exists in ${menuTypeName.toLowerCase()} menu`;
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

  let syncWithNavbar = false;
  if (source === "main" && navbarExists && navbar) {
    syncWithNavbar = await confirm({
      message: 'Also add this menu item to the navbar?',
      default: true,
    });

    if (syncWithNavbar) {
      if (navbar.navbarMenuItems.some((item) => item.itemName === itemName)) {
        console.log('❌ Menu item name already exists in navbar. Adding to footer only.');
        syncWithNavbar = false;
      }
    }
  }

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

  footer[menuArrayKey].push(newMenuItem);

  if (syncWithNavbar && navbar) {
    navbar.navbarMenuItems.push({ ...newMenuItem });
  }

  try {
    const formattedFooter = await prettier.format(JSON.stringify(footer), {
      parser: 'json',
    });
    await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
    console.log(`✅ Menu item "${newMenuItem.itemName}" added to ${menuTypeName.toLowerCase()} footer menu`);

    if (syncWithNavbar && navbar) {
      const formattedNavbar = await prettier.format(JSON.stringify(navbar), {
        parser: 'json',
      });
      await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
      console.log(`✅ Menu item "${newMenuItem.itemName}" also added to navbar`);
    }
  } catch (error) {
    console.error('❌ Error writing files:', error);
  }
}