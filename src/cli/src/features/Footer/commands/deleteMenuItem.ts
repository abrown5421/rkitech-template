import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { Footer, DeleteFooterMenuItemOptions } from '../types/footerTypes.js';
import { Navbar } from '../../Navbar/types/navTypes.js';

export async function deleteMenuItem(sourceOrOptions: "main" | "aux" | DeleteFooterMenuItemOptions): Promise<boolean> {
  let source: "main" | "aux";
  let options: DeleteFooterMenuItemOptions | undefined;
  
  if (typeof sourceOrOptions === 'string') {
    source = sourceOrOptions;
    options = { source, skipPrompts: false };
  } else {
    options = sourceOrOptions;
    source = options.source;
  }

  const {
    itemID: optItemID,
    deleteFromNavbar: optDeleteFromNavbar,
    skipPrompts
  } = options;

  const footerJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Footer/json/footer.json'
  );

  const navbarJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Navbar/json/navbar.json'
  );

  const menuTypeName = source === "main" ? "Primary" : "Auxiliary";
  const menuArrayKey = source === "main" ? "footerPrimaryMenuItems" : "footerAuxilaryMenuItems";

  try {
    await fs.access(footerJsonPath);
  } catch (error) {
    console.error(`❌ Could not find footer.json at: ${footerJsonPath}`);
    console.log('Please ensure the footer.json file exists in the correct location.');
    return false;
  }

  let footer: Footer;
  try {
    const footerRaw = await fs.readFile(footerJsonPath, 'utf-8');
    footer = JSON.parse(footerRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing footer.json:', error);
    return false;
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
      if (!skipPrompts) {
        console.warn('⚠️ Navbar.json not found - skipping navbar synchronization');
      }
    }
  }

  if (footer[menuArrayKey].length === 0) {
    console.log(`❌ No menu items found in ${menuTypeName.toLowerCase()} menu to delete.`);
    return false;
  }

  if (!skipPrompts) {
    console.log(`\n🗑️ Deleting menu item from ${menuTypeName} Footer Menu\n`);
  }

  const itemToDelete = skipPrompts && optItemID ? optItemID : await select({
    message: `Select a menu item to delete from ${menuTypeName.toLowerCase()} menu:`,
    choices: footer[menuArrayKey].map((item) => ({
      name: `${item.itemName} (${item.itemType})`,
      value: item.itemID,
    })),
  });

  const selectedItem = footer[menuArrayKey].find((item) => item.itemID === itemToDelete);
  if (!selectedItem) {
    console.error('❌ Selected menu item not found.');
    return false;
  }

  let existsInNavbar = false;
  if (source === "main" && navbarExists && navbar) {
    existsInNavbar = navbar.navbarMenuItems.some((item) => 
      item.itemName === selectedItem.itemName || item.itemID === selectedItem.itemID
    );
  }

  let deleteFromBoth = false;
  if (existsInNavbar) {
    if (skipPrompts && optDeleteFromNavbar !== undefined) {
      deleteFromBoth = optDeleteFromNavbar;
    } else {
      deleteFromBoth = await confirm({
        message: `"${selectedItem.itemName}" also exists in the navbar. Delete from both footer and navbar?`,
        default: true,
      });
    }
  }

  const confirmDelete = skipPrompts ? true : await confirm({
    message: `Are you sure you want to delete "${selectedItem.itemName}"${deleteFromBoth ? ' from both footer and navbar' : ` from the ${menuTypeName.toLowerCase()} menu`}? This action cannot be undone.`,
    default: false,
  });

  if (!confirmDelete) {
    console.log('❌ Deletion cancelled.');
    return false;
  }

  footer[menuArrayKey] = footer[menuArrayKey].filter((item) => item.itemID !== itemToDelete);

  if (deleteFromBoth && navbar) {
    navbar.navbarMenuItems = navbar.navbarMenuItems.filter((item) => 
      item.itemName !== selectedItem.itemName && item.itemID !== selectedItem.itemID
    );
  }

  try {
    const formattedFooter = await prettier.format(JSON.stringify(footer), {
      parser: 'json',
    });
    await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
    console.log(`✅ Menu item "${selectedItem.itemName}" deleted successfully from ${menuTypeName.toLowerCase()} footer menu`);

    if (deleteFromBoth && navbar) {
      const formattedNavbar = await prettier.format(JSON.stringify(navbar), {
        parser: 'json',
      });
      await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
      console.log(`✅ Menu item "${selectedItem.itemName}" also deleted from navbar`);
    }
  } catch (error) {
    console.error('❌ Error writing files:', error);
    return false;
  }

  return true;
}