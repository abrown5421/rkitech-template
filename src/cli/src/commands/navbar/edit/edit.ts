import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { NavItem } from "../../../shared/types/navItemTypes.js";
import { COLORS, INTENSITIES } from "../../../shared/constants/pageConstants.js";
import { formatFile } from "../../../shared/utils/formatFile.js";

async function loadNavbarItems(): Promise<NavItem[]> {
  const navbarJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/navbar.json");
  const fileContent = await fs.readFile(navbarJsonPath, "utf-8");
  return JSON.parse(fileContent) || [];
}

async function promptNavbarSelection(items: NavItem[]): Promise<NavItem | null> {
  if (items.length === 0) {
    console.log("No navbar items to edit.");
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
      message: "Select a navbar item to edit:",
      choices
    }
  ]);

  return answer.selectedItem;
}

async function promptNavbarEdits(item: NavItem, allItems: NavItem[]): Promise<Partial<NavItem>> {
  const otherItems = allItems.filter(i => i.itemID !== item.itemID);
  const existingNames = otherItems.map(i => i.itemName.toLowerCase());

  return inquirer.prompt([
    {
      type: "input",
      name: "itemName",
      message: "Item Name:",
      default: item.itemName,
      validate: (input: string) => {
        if (!input.trim()) return "Item name cannot be blank";
        if (existingNames.includes(input.toLowerCase())) return "Name already exists";
        return true;
      }
    },
    {
      type: "list",
      name: "itemType",
      message: "Item Type:",
      choices: ["page", "link"],
      default: item.itemType
    },
    {
      type: "input",
      name: "itemLink",
      message: "Item Link (for links only):",
      default: item.itemLink || "",
      when: (answers) => answers.itemType === "link"
    },
    {
      type: "list",
      name: "itemColor",
      message: "Item Color:",
      choices: COLORS,
      default: item.itemColor
    },
    {
      type: "list",
      name: "itemIntensity",
      message: "Item Intensity:",
      choices: INTENSITIES.map((i) => i.toString()),
      default: item.itemIntensity?.toString(),
      filter: (input: string) => parseInt(input, 10)
    },
    {
      type: "list",
      name: "itemHoverColor",
      message: "Hover Color:",
      choices: COLORS,
      default: item.itemHoverColor
    },
    {
      type: "list",
      name: "itemHoverIntensity",
      message: "Hover Intensity:",
      choices: INTENSITIES.map((i) => i.toString()),
      default: item.itemHoverIntensity?.toString(),
      filter: (input: string) => parseInt(input, 10)
    },
    {
      type: "list",
      name: "itemActiveColor",
      message: "Active Color:",
      choices: COLORS,
      default: item.itemActiveColor
    },
    {
      type: "list",
      name: "itemActiveIntensity",
      message: "Active Intensity:",
      choices: INTENSITIES.map((i) => i.toString()),
      default: item.itemActiveIntensity?.toString(),
      filter: (input: string) => parseInt(input, 10)
    }
  ]);
}

async function updateNavbarItemInJson(updatedItem: NavItem): Promise<void> {
  const navbarJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/navbar.json");
  const items = await loadNavbarItems();
  const updatedItems = items.map(i => (i.itemID === updatedItem.itemID ? updatedItem : i));
  await fs.writeFile(navbarJsonPath, JSON.stringify(updatedItems, null, 2), "utf-8");
  console.log(`✅ Updated "${updatedItem.itemName}" in navbar.json`);
}

export async function editNavbarCommand(): Promise<void> {
  try {
    console.log("✏️  Edit Navbar Item Command");
    const items = await loadNavbarItems();
    const itemToEdit = await promptNavbarSelection(items);
    if (!itemToEdit) return console.log("Edit operation cancelled.");

    const updatedData = await promptNavbarEdits(itemToEdit, items);
    const updatedItem: NavItem = { ...itemToEdit, ...updatedData };

    await updateNavbarItemInJson(updatedItem);

  } catch (error) {
    console.error("❌ Error during edit operation:", error);
    process.exit(1);
  }
}
