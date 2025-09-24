import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { Navbar } from '../types/navTypes.js';
import { Footer } from '../../Footer/types/footerTypes.js';

export async function deleteMenuItem() {
  const navbarJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Navbar/json/navbar.json'
  );

  const footerJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Footer/json/footer.json'
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

  let footer: Footer | null = null;
  let footerExists = false;
  try {
    await fs.access(footerJsonPath);
    const footerRaw = await fs.readFile(footerJsonPath, 'utf-8');
    footer = JSON.parse(footerRaw);
    footerExists = true;
  } catch (error) {
    console.warn('⚠️ Footer.json not found - skipping footer synchronization');
  }

  if (navbar.navbarMenuItems.length === 0) {
    console.log('❌ No menu items found to delete.');
    return;
  }

  console.log('\n🗑️ Deleting menu item from Navbar\n');

  const itemToDelete = await select({
    message: 'Select a menu item to delete:',
    choices: navbar.navbarMenuItems.map((item) => ({
      name: `${item.itemName} (${item.itemType})`,
      value: item.itemID,
    })),
  });

  const selectedItem = navbar.navbarMenuItems.find((item) => item.itemID === itemToDelete);
  if (!selectedItem) {
    console.error('❌ Selected menu item not found.');
    return;
  }
  
  let existsInFooter = false;
  if (footerExists && footer) {
    existsInFooter = footer.footerPrimaryMenuItems.some((item) => 
      item.itemName === selectedItem.itemName || item.itemID === selectedItem.itemID
    );
  }

  let deleteFromBoth = false;
  if (existsInFooter) {
    deleteFromBoth = await confirm({
      message: `"${selectedItem.itemName}" also exists in the footer primary menu. Delete from both navbar and footer?`,
      default: true,
    });
  }

  const confirmDelete = await confirm({
    message: `Are you sure you want to delete "${selectedItem.itemName}"${deleteFromBoth ? ' from both navbar and footer' : ' from navbar'}? This action cannot be undone.`,
    default: false,
  });

  if (!confirmDelete) {
    console.log('❌ Deletion cancelled.');
    return;
  }

  navbar.navbarMenuItems = navbar.navbarMenuItems.filter((item) => item.itemID !== itemToDelete);

  if (deleteFromBoth && footer) {
    footer.footerPrimaryMenuItems = footer.footerPrimaryMenuItems.filter((item) => 
      item.itemName !== selectedItem.itemName && item.itemID !== selectedItem.itemID
    );
  }

  try {
    const formattedNavbar = await prettier.format(JSON.stringify(navbar), {
      parser: 'json',
    });
    await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
    console.log(`✅ Menu item "${selectedItem.itemName}" deleted successfully from navbar`);

    if (deleteFromBoth && footer) {
      const formattedFooter = await prettier.format(JSON.stringify(footer), {
        parser: 'json',
      });
      await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
      console.log(`✅ Menu item "${selectedItem.itemName}" also deleted from footer primary menu`);
    }
  } catch (error) {
    console.error('❌ Error writing files:', error);
  }
}