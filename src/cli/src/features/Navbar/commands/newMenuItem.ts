import { input, select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../../Pages/types/pageTypes.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { createGUID } from '../../../shared/utils/createGUID.js';
import { selectColorAndIntensity } from '../../../shared/utils/menuItemHelpers.js';
import { Navbar, NewMenuItemOptions } from '../types/navTypes.js';
import { Footer } from '../../Footer/types/footerTypes.js';
import { NavItem } from '../../../shared/types/navItemTypes.js';

export async function newMenuItem(options?: NewMenuItemOptions) {
  const {
    itemName: optItemName,
    itemType: optItemType,
    itemID: optItemID,
    itemLink: optItemLink,
    itemOrder: optItemOrder,
    itemColor: optItemColor,
    itemIntensity: optItemIntensity,
    itemHoverColor: optItemHoverColor,
    itemHoverIntensity: optItemHoverIntensity,
    itemActiveColor: optItemActiveColor,
    itemActiveIntensity: optItemActiveIntensity,
    itemBackgroundColor: optItemBackgroundColor,
    itemBackgroundIntensity: optItemBackgroundIntensity,
    itemBackgroundHoverColor: optItemBackgroundHoverColor,
    itemBackgroundHoverIntensity: optItemBackgroundHoverIntensity,
    itemBorderColor: optItemBorderColor,
    itemBorderIntensity: optItemBorderIntensity,
    itemBorderHoverColor: optItemBorderHoverColor,
    itemBorderHoverIntensity: optItemBorderHoverIntensity,
    itemEntranceAnimation: optItemEntranceAnimation,
    itemExitAnimation: optItemExitAnimation,
    syncWithFooter: optSyncWithFooter,
    skipPrompts
  } = options || {};

  const navbarJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Navbar/json/navbar.json');
  const footerJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Footer/json/footer.json');
  const pagesJsonPath = path.resolve(process.cwd(), 'src/cli/src/features/Pages/json/pages.json');

  let navbar: Navbar;
  try {
    await fs.access(navbarJsonPath);
    const navbarRaw = await fs.readFile(navbarJsonPath, 'utf-8');
    navbar = JSON.parse(navbarRaw);
  } catch (error) {
    console.error(`❌ Could not find or read navbar.json at: ${navbarJsonPath}`);
    return;
  }

  let footer: Footer | null = null;
  let footerExists = false;
  try {
    await fs.access(footerJsonPath);
    const footerRaw = await fs.readFile(footerJsonPath, 'utf-8');
    footer = JSON.parse(footerRaw);
    footerExists = true;
  } catch (error) {
    if (!skipPrompts) {
      console.warn('⚠️ Footer.json not found - skipping footer synchronization');
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

  if (!skipPrompts) {
    console.log('\n🔧 Adding new menu item to Navbar\n');
  }

  const itemName = skipPrompts && optItemName ? optItemName : await input({
    message: 'Enter the menu item name:',
    validate: (input: string) => {
      if (!input) return 'Menu item name is required';
      if (navbar.navbarMenuItems.some((item) => item.itemName === input)) {
        return 'Menu item name already exists in navbar';
      }
      return true;
    },
  });

  const itemType = skipPrompts && optItemType ? optItemType : await select({
    message: 'Select menu item type:',
    choices: [
      { name: 'page', value: 'page' },
      { name: 'link', value: 'link' },
    ],
  }) as 'page' | 'link';

  let itemID = '';
  let itemLink = '';

  const itemStyle = skipPrompts && options?.itemStyle ? options.itemStyle : await select({
    message: 'Select menu item style:',
    choices: [
      { name: 'string', value: 'string' },
      { name: 'button', value: 'button' },
    ],
  }) as 'string' | 'button';

  if (itemType === 'page') {
    const activePages = pages.filter((page) => page.pageActive);
    if (activePages.length === 0) {
      console.log('❌ No active pages found. Please create and activate a page first.');
      return;
    }

    if (skipPrompts && optItemID) {
      itemID = optItemID;
    } else {
      itemID = await select({
        message: 'Select a page to link to:',
        choices: activePages.map((page) => ({
          name: `${page.pageName} (${page.pagePath})`,
          value: page.pageID,
        })),
      });
    }
  } else {
    if (skipPrompts && optItemLink) {
      itemLink = optItemLink;
      itemID = optItemID || createGUID();
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
  }

  const itemOrder = skipPrompts && optItemOrder !== undefined ? optItemOrder : await input({
    message: 'Enter the menu item order (positive number):',
    default: String(navbar.navbarMenuItems.length + 1),
    validate: (input: string) => {
      const num = parseInt(input, 10);
      if (isNaN(num) || num < 1) {
        return 'Please enter a valid positive number';
      }
      return true;
    },
    transformer: (input: string) => input,
  }).then((val) => parseInt(val, 10));

  let itemColor, itemIntensity, itemHoverColor, itemHoverIntensity, itemActiveColor, itemActiveIntensity, itemBackgroundColor, itemBackgroundIntensity, itemBackgroundHoverColor, itemBackgroundHoverIntensity, itemBorderColor, itemBorderIntensity, itemBorderHoverColor, itemBorderHoverIntensity;
  if (skipPrompts) {
    itemColor = optItemColor!;
    itemIntensity = optItemIntensity!;
    itemHoverColor = optItemHoverColor!;
    itemHoverIntensity = optItemHoverIntensity!;
    itemActiveColor = optItemActiveColor!;
    itemActiveIntensity = optItemActiveIntensity!;
    itemBackgroundColor = optItemBackgroundColor!;
    itemBackgroundIntensity = optItemBackgroundIntensity!;
    itemBorderColor = optItemBorderColor!;
    itemBorderIntensity = optItemBorderIntensity!;
    itemBorderHoverColor = optItemBorderHoverColor!;
    itemBorderHoverIntensity = optItemBorderHoverIntensity!;
    itemBackgroundHoverColor = optItemBackgroundHoverColor!;
    itemBackgroundHoverIntensity = optItemBackgroundHoverIntensity!;
  } else {
    const itemColors = await selectColorAndIntensity('item');
    itemColor = itemColors.color;
    itemIntensity = itemColors.intensity;

    const itemHoverColors = await selectColorAndIntensity('item hover');
    itemHoverColor = itemHoverColors.color;
    itemHoverIntensity = itemHoverColors.intensity;

    const itemActiveColors = await selectColorAndIntensity('item active');
    itemActiveColor = itemActiveColors.color;
    itemActiveIntensity = itemActiveColors.intensity;

    if (itemStyle === 'button') {
      const bgColors = await selectColorAndIntensity('item background');
      itemBackgroundColor = bgColors.color;
      itemBackgroundIntensity = bgColors.intensity;

      const bgHoverColors = await selectColorAndIntensity('item background hover');
      itemBackgroundHoverColor = bgHoverColors.color;
      itemBackgroundHoverIntensity = bgHoverColors.intensity;
      
      const borderColors = await selectColorAndIntensity('item border');
      itemBorderColor = borderColors.color;
      itemBorderIntensity = borderColors.intensity;

      const borderHoverColors = await selectColorAndIntensity('item border hover');
      itemBorderHoverColor = borderHoverColors.color;
      itemBorderHoverIntensity = borderHoverColors.intensity;
    }
  }

  const itemEntranceAnimation = skipPrompts && optItemEntranceAnimation ? optItemEntranceAnimation : await select({
    message: 'Select entrance animation:',
    choices: ENTRANCE_ANIMATIONS.map((animation) => ({ name: animation, value: animation })),
  });

  const itemExitAnimation = skipPrompts && optItemExitAnimation ? optItemExitAnimation : await select({
    message: 'Select exit animation:',
    choices: EXIT_ANIMATIONS.map((animation) => ({ name: animation, value: animation })),
  });
  
  let syncWithFooter = false;
  if (footerExists && footer) {
    if (skipPrompts && optSyncWithFooter !== undefined) {
      syncWithFooter = optSyncWithFooter;
      if (syncWithFooter && footer.footerPrimaryMenuItems.some((item) => item.itemName === itemName)) {
        console.log('❌ Menu item name already exists in footer primary menu. Adding to navbar only.');
        syncWithFooter = false;
      }
    } else {
      syncWithFooter = await confirm({
        message: 'Also add this menu item to the footer primary menu?',
        default: true,
      });

      if (syncWithFooter && footer.footerPrimaryMenuItems.some((item) => item.itemName === itemName)) {
        console.log('❌ Menu item name already exists in footer primary menu. Adding to navbar only.');
        syncWithFooter = false;
      }
    }
  }

  const newMenuItem: NavItem = {
    itemName,
    itemType: itemType as 'page' | 'link',
    itemStyle: itemStyle as 'string' | 'button',
    itemID,
    itemOrder,
    itemColor,
    itemIntensity,
    itemHoverColor,
    itemHoverIntensity,
    itemActiveColor,
    itemActiveIntensity,
    itemEntranceAnimation,
    itemExitAnimation,
    ...(itemStyle === 'button' && {
      itemBackgroundColor,
      itemBackgroundIntensity,
      itemBackgroundHoverColor,
      itemBackgroundHoverIntensity,
      itemBorderColor,
      itemBorderIntensity,
      itemBorderHoverColor,
      itemBorderHoverIntensity,
    }),
    ...(itemType === 'link' && { itemLink }),
  };

  navbar.navbarMenuItems.push(newMenuItem);
  if (syncWithFooter && footer) {
    footer.footerPrimaryMenuItems.push({ ...newMenuItem });
  }

  try {
    const formattedNavbar = await prettier.format(JSON.stringify(navbar), { parser: 'json' });
    await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
    console.log(`✅ Menu item "${newMenuItem.itemName}" added to navbar`);

    if (syncWithFooter && footer) {
      const formattedFooter = await prettier.format(JSON.stringify(footer), { parser: 'json' });
      await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
      console.log(`✅ Menu item "${newMenuItem.itemName}" also added to footer primary menu`);
    }
  } catch (error) {
    console.error('❌ Error writing files:', error);
  }
}