import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { NavItem } from "../../../shared/types/navItemTypes.js";

async function loadNavbarItems(): Promise<NavItem[]> {
  try {
    const navbarJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/navbar.json");
    const fileContent = await fs.readFile(navbarJsonPath, "utf-8");
    const itemsArray = JSON.parse(fileContent);
    if (!Array.isArray(itemsArray)) {
      console.warn("navbar.json does not contain an array");
      return [];
    }
    return itemsArray;
  } catch (error) {
    console.error("❌ Error reading navbar.json:", error);
    return [];
  }
}

async function promptNavbarSelection(items: NavItem[]): Promise<NavItem | null> {
  if (items.length === 0) {
    console.log("No navbar items to delete.");
    return null;
  }

  const choices = items.map(item => ({
    name: `${item.itemName} (${item.itemType})`,
    value: item
  }));

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedItem",
      message: "Select a navbar item to delete:",
      choices
    }
  ]);

  const confirmAnswer = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmDelete",
      message: `Are you sure you want to delete "${answer.selectedItem.itemName}"?`,
      default: false
    }
  ]);

  return confirmAnswer.confirmDelete ? answer.selectedItem : null;
}

async function removeItemFromJson(itemToDelete: NavItem): Promise<void> {
  const navbarJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/navbar.json");
  const items = await loadNavbarItems();
  const updatedItems = items.filter(item => item.itemID !== itemToDelete.itemID);
  await fs.writeFile(navbarJsonPath, JSON.stringify(updatedItems, null, 2), "utf-8");
  console.log(`✅ Removed "${itemToDelete.itemName}" from navbar.json`);
}

export async function deleteNavbarCommand(): Promise<void> {
  try {
    console.log("🗑️  Delete Navbar Item Command");
    const items = await loadNavbarItems();
    const itemToDelete = await promptNavbarSelection(items);
    if (!itemToDelete) return console.log("Delete operation cancelled.");
    await removeItemFromJson(itemToDelete);
  } catch (error) {
    console.error("❌ Error during delete operation:", error);
    process.exit(1);
  }
}
