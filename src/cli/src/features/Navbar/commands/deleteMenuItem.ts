import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { Navbar } from '../types/navTypes';

export async function deleteMenuItem() {
  const navbarJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Navbar/json/navbar.json'
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

  if (navbar.navbarMenuItems.length === 0) {
    console.log('❌ No menu items found to delete.');
    return;
  }

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

  const confirmDelete = await confirm({
    message: `Are you sure you want to delete "${selectedItem.itemName}"? This action cannot be undone.`,
    default: false,
  });

  if (!confirmDelete) {
    console.log('❌ Deletion cancelled.');
    return;
  }

  navbar.navbarMenuItems = navbar.navbarMenuItems.filter((item) => item.itemID !== itemToDelete);

  try {
    const formattedNavbar = await prettier.format(JSON.stringify(navbar), {
      parser: 'json',
    });
    await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
    console.log(`✅ Menu item "${selectedItem.itemName}" deleted successfully`);
  } catch (error) {
    console.error('❌ Error writing to navbar.json:', error);
  }
}