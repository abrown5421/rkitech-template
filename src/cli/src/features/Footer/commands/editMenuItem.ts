import { input, select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../../Pages/types/pageTypes.js';
import { COLORS, INTENSITIES } from '../../../shared/constants/tailwindConstants.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { createGUID } from '../../../shared/utils/createGUID.js';
import { Footer } from '../types/footerTypes.js';
import { NavItem } from '../../../shared/types/navItemTypes.js';

export async function editMenuItem(source: "main" | "aux") {
  const footerJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Footer/json/footer.json'
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

  if (footer[menuArrayKey].length === 0) {
    console.log(`❌ No menu items found in ${menuTypeName.toLowerCase()} menu to edit.`);
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

  console.log(`\n✏️  Editing menu item in ${menuTypeName} Footer Menu\n`);

  const itemToEdit = await select({
    message: `Select a menu item to edit from ${menuTypeName.toLowerCase()} menu:`,
    choices: footer[menuArrayKey].map((item) => ({
      name: `${item.itemName} (${item.itemType})`,
      value: item.itemID,
    })),
  });

  const selectedItem = footer[menuArrayKey].find((item) => item.itemID === itemToEdit);
  if (!selectedItem) {
    console.error('❌ Selected menu item not found.');
    return;
  }

  const newItemName = await input({
    message: 'Enter the menu item name:',
    default: selectedItem.itemName,
    validate: (input: string) => {
      if (!input) return 'Menu item name is required';
      if (input !== selectedItem.itemName && 
          footer[menuArrayKey].some((item) => item.itemName === input)) {
        return `Menu item name already exists in ${menuTypeName.toLowerCase()} menu`;
      }
      return true;
    },
  });

  const newItemType = await select({
    message: 'Select menu item type:',
    choices: [
      { name: 'page', value: 'page' },
      { name: 'link', value: 'link' },
    ],
    default: selectedItem.itemType,
  });

  let newItemID = selectedItem.itemID;
  let newItemLink = selectedItem.itemLink;

  if (newItemType === 'page') {
    const activePages = pages.filter((page) => page.pageActive);
    
    if (activePages.length === 0) {
      console.log('❌ No active pages found. Please create and activate a page first.');
      return;
    }

    const currentPageDefault = selectedItem.itemType === 'page' ? selectedItem.itemID : undefined;

    newItemID = await select({
      message: 'Select a page to link to:',
      choices: activePages.map((page) => ({
        name: `${page.pageName} (${page.pagePath})`,
        value: page.pageID,
      })),
      default: currentPageDefault,
    });
    
    newItemLink = undefined;
  } else {
    const currentLinkDefault = selectedItem.itemType === 'link' ? selectedItem.itemLink : '';
    
    newItemLink = await input({
      message: 'Enter the external link URL:',
      default: currentLinkDefault,
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
    
    if (selectedItem.itemType !== 'link') {
      newItemID = createGUID();
    }
  }

  const newItemColor = await select({
    message: 'Select item color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
    default: selectedItem.itemColor,
  });

  const newItemIntensity = await select({
    message: 'Select item intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
    default: selectedItem.itemIntensity,
  });

  const newItemHoverColor = await select({
    message: 'Select item hover color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
    default: selectedItem.itemHoverColor,
  });

  const newItemHoverIntensity = await select({
    message: 'Select item hover intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
    default: selectedItem.itemHoverIntensity,
  });

  const newItemActiveColor = await select({
    message: 'Select item active color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
    default: selectedItem.itemActiveColor,
  });

  const newItemActiveIntensity = await select({
    message: 'Select item active intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
    default: selectedItem.itemActiveIntensity,
  });

  const newItemEntranceAnimation = await select({
    message: 'Select entrance animation:',
    choices: ENTRANCE_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
    default: selectedItem.itemEntranceAnimation,
  });

  const newItemExitAnimation = await select({
    message: 'Select exit animation:',
    choices: EXIT_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
    default: selectedItem.itemExitAnimation,
  });

  const updatedMenuItem: NavItem = {
    itemName: newItemName,
    itemType: newItemType as 'page' | 'link',
    itemID: newItemID,
    itemColor: newItemColor,
    itemIntensity: newItemIntensity,
    itemHoverColor: newItemHoverColor,
    itemHoverIntensity: newItemHoverIntensity,
    itemActiveColor: newItemActiveColor,
    itemActiveIntensity: newItemActiveIntensity,
    itemEntranceAnimation: newItemEntranceAnimation,
    itemExitAnimation: newItemExitAnimation,
    ...(newItemType === 'link' && { itemLink: newItemLink }),
  };

  const itemIndex = footer[menuArrayKey].findIndex((item) => item.itemID === itemToEdit);
  footer[menuArrayKey][itemIndex] = updatedMenuItem;

  try {
    const formattedFooter = await prettier.format(JSON.stringify(footer), {
      parser: 'json',
    });
    await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
    console.log(`✅ Menu item "${updatedMenuItem.itemName}" updated successfully in ${menuTypeName.toLowerCase()} footer menu`);
  } catch (error) {
    console.error('❌ Error writing to footer.json:', error);
  }
}