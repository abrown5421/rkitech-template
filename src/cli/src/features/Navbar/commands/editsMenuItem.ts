import { input, select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../../Pages/types/pageTypes.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { createGUID } from '../../../shared/utils/createGUID.js';
import { selectColorAndIntensity } from '../../../shared/utils/menuItemHelpers.js';
import { Navbar, EditMenuItemOptions } from '../types/navTypes.js';
import { NavItem } from '../../../shared/types/navItemTypes.js';
import { EntranceAnimation, ExitAnimation } from 'rkitech-components';

export async function editMenuItem(options?: EditMenuItemOptions): Promise<string | undefined> {
  const {
    itemID: optItemID,
    itemName: optItemName,
    itemType: optItemType,
    pageID: optPageID,
    itemLink: optItemLink,
    itemColor: optItemColor,
    itemIntensity: optItemIntensity,
    itemHoverColor: optItemHoverColor,
    itemHoverIntensity: optItemHoverIntensity,
    itemActiveColor: optItemActiveColor,
    itemActiveIntensity: optItemActiveIntensity,
    itemEntranceAnimation: optItemEntranceAnimation,
    itemExitAnimation: optItemExitAnimation,
    skipPrompts
  } = options || {};

  const navbarJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Navbar/json/navbar.json');
  const pagesJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Pages/json/pages.json');

  let navbar: Navbar;
  try {
    await fs.access(navbarJsonPath);
    const navbarRaw = await fs.readFile(navbarJsonPath, 'utf-8');
    navbar = JSON.parse(navbarRaw);
  } catch (error) {
    console.error(`❌ Could not find or read navbar.json at: ${navbarJsonPath}`);
    return undefined;
  }

  if (navbar.navbarMenuItems.length === 0) {
    console.log('❌ No menu items found to edit.');
    return undefined;
  }

  let pages: PageData[] = [];
  try {
    await fs.access(pagesJsonPath);
    const pagesRaw = await fs.readFile(pagesJsonPath, 'utf-8');
    pages = JSON.parse(pagesRaw);
  } catch (error) {
    console.error('❌ Error reading pages.json:', error);
    return undefined;
  }

  if (!skipPrompts) {
    console.log('\n✏️  Editing navbar menu item\n');
  }

  const itemToEdit = skipPrompts && optItemID ? optItemID : await select({
    message: 'Select a menu item to edit:',
    choices: navbar.navbarMenuItems.map((item) => ({
      name: `${item.itemName} (${item.itemType})`,
      value: item.itemID,
    })),
  });

  const selectedItem = navbar.navbarMenuItems.find((item) => item.itemID === itemToEdit);
  if (!selectedItem) {
    console.error('❌ Selected menu item not found.');
    return undefined;
  }

  const newItemName = skipPrompts && optItemName ? optItemName : await input({
    message: 'Enter the menu item name:',
    default: selectedItem.itemName,
    validate: (input: string) => {
      if (!input) return 'Menu item name is required';
      if (input !== selectedItem.itemName && 
          navbar.navbarMenuItems.some((item) => item.itemName === input)) {
        return 'Menu item name already exists';
      }
      return true;
    },
  });

  const newItemType = skipPrompts && optItemType ? optItemType : await select({
    message: 'Select menu item type:',
    choices: [
      { name: 'page', value: 'page' },
      { name: 'link', value: 'link' },
    ],
    default: selectedItem.itemType,
  }) as 'page' | 'link';

  let newItemID = selectedItem.itemID;
  let newItemLink = selectedItem.itemLink;

  if (newItemType === 'page') {
    const activePages = pages.filter((page) => page.pageActive);
    if (activePages.length === 0) {
      console.log('❌ No active pages found. Please create and activate a page first.');
      return undefined;
    }

    if (skipPrompts && optPageID) {
      newItemID = optPageID;
    } else {
      const currentPageDefault = selectedItem.itemType === 'page' ? selectedItem.itemID : undefined;
      newItemID = await select({
        message: 'Select a page to link to:',
        choices: activePages.map((page) => ({
          name: `${page.pageName} (${page.pagePath})`,
          value: page.pageID,
        })),
        ...(currentPageDefault && { default: currentPageDefault }),
      });
    }
    newItemLink = undefined;
  } else {
    if (skipPrompts && optItemLink) {
      newItemLink = optItemLink;
      if (selectedItem.itemType !== 'link') {
        newItemID = createGUID();
      }
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
  }

  let newItemColor, newItemIntensity, newItemHoverColor, newItemHoverIntensity, newItemActiveColor, newItemActiveIntensity;

  if (skipPrompts) {
    newItemColor = optItemColor!;
    newItemIntensity = optItemIntensity!;
    newItemHoverColor = optItemHoverColor!;
    newItemHoverIntensity = optItemHoverIntensity!;
    newItemActiveColor = optItemActiveColor!;
    newItemActiveIntensity = optItemActiveIntensity!;
  } else {
    const itemColors = await selectColorAndIntensity(
      'item', 
      selectedItem.itemColor, 
      selectedItem.itemIntensity
    );
    newItemColor = itemColors.color;
    newItemIntensity = itemColors.intensity;
    
    const itemHoverColors = await selectColorAndIntensity(
      'item hover', 
      selectedItem.itemHoverColor, 
      selectedItem.itemHoverIntensity
    );
    newItemHoverColor = itemHoverColors.color;
    newItemHoverIntensity = itemHoverColors.intensity;
    
    const itemActiveColors = await selectColorAndIntensity(
      'item active', 
      selectedItem.itemActiveColor, 
      selectedItem.itemActiveIntensity
    );
    newItemActiveColor = itemActiveColors.color;
    newItemActiveIntensity = itemActiveColors.intensity;
  }

  const newItemEntranceAnimation = skipPrompts && optItemEntranceAnimation ? optItemEntranceAnimation : await select({
    message: 'Select entrance animation:',
    choices: ENTRANCE_ANIMATIONS.map((animation) => ({ name: animation, value: animation })),
    default: selectedItem.itemEntranceAnimation,
  });

  const newItemExitAnimation = skipPrompts && optItemExitAnimation ? optItemExitAnimation : await select({
    message: 'Select exit animation:',
    choices: EXIT_ANIMATIONS.map((animation) => ({ name: animation, value: animation })),
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
    itemEntranceAnimation: newItemEntranceAnimation as EntranceAnimation,
    itemExitAnimation: newItemExitAnimation as ExitAnimation,
    ...(newItemType === 'link' && { itemLink: newItemLink }),
  };

  const itemIndex = navbar.navbarMenuItems.findIndex((item) => item.itemID === itemToEdit);
  navbar.navbarMenuItems[itemIndex] = updatedMenuItem;

  try {
    const formattedNavbar = await prettier.format(JSON.stringify(navbar), { parser: 'json' });
    await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
    console.log(`✅ Menu item "${updatedMenuItem.itemName}" updated successfully`);
  } catch (error) {
    console.error('❌ Error writing to navbar.json:', error);
    return undefined;
  }

  return updatedMenuItem.itemID;
}