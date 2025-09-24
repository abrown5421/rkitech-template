import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { Footer } from '../types/footerTypes.js';

export async function deleteMenuItem(source: "main" | "aux") {
  const footerJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Footer/json/footer.json'
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
    console.log(`❌ No menu items found in ${menuTypeName.toLowerCase()} menu to delete.`);
    return;
  }

  console.log(`\n🗑️  Deleting menu item from ${menuTypeName} Footer Menu\n`);

  const itemToDelete = await select({
    message: `Select a menu item to delete from ${menuTypeName.toLowerCase()} menu:`,
    choices: footer[menuArrayKey].map((item) => ({
      name: `${item.itemName} (${item.itemType})`,
      value: item.itemID,
    })),
  });

  const selectedItem = footer[menuArrayKey].find((item) => item.itemID === itemToDelete);
  if (!selectedItem) {
    console.error('❌ Selected menu item not found.');
    return;
  }

  const confirmDelete = await confirm({
    message: `Are you sure you want to delete "${selectedItem.itemName}" from the ${menuTypeName.toLowerCase()} menu? This action cannot be undone.`,
    default: false,
  });

  if (!confirmDelete) {
    console.log('❌ Deletion cancelled.');
    return;
  }

  footer[menuArrayKey] = footer[menuArrayKey].filter((item) => item.itemID !== itemToDelete);

  try {
    const formattedFooter = await prettier.format(JSON.stringify(footer), {
      parser: 'json',
    });
    await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
    console.log(`✅ Menu item "${selectedItem.itemName}" deleted successfully from ${menuTypeName.toLowerCase()} footer menu`);
  } catch (error) {
    console.error('❌ Error writing to footer.json:', error);
  }
}