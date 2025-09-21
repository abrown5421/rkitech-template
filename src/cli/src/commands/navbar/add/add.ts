import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { COLORS, ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS, INTENSITIES } from "../../../shared/constants/pageConstants.js";
import { createGUID } from "../../../shared/utils/createGUID.js";
import { NavItem } from "../../../shared/types/navItemTypes.js";

async function loadExistingNavItems(): Promise<NavItem[]> {
  try {
    const navJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/navbar.json");
    const fileContent = await fs.readFile(navJsonPath, "utf-8");
    const navArray = JSON.parse(fileContent);
    
    if (!Array.isArray(navArray)) {
      return [];
    }
    
    return navArray;
  } catch (error) {
    return [];
  }
}

async function promptNavItemInfo() {
  const existingNavItems = await loadExistingNavItems();
  const existingNames = existingNavItems.map(item => item.itemName.toLowerCase());

  const navItemAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "itemName",
      message: "Navbar Item Name:",
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return "Item name is required. Please enter a valid name.";
        }
        if (existingNames.includes(input.toLowerCase())) {
          return `Item name "${input}" already exists. Please choose a different name.`;
        }
        return true;
      }
    },
    {
      type: "list",
      name: "itemType",
      message: "Item Type:",
      choices: ["page", "link"],
    },
    {
      type: "input",
      name: "itemLink",
      message: "Link URL (if type is 'link', optional for pages):",
      default: "",
      when: (answers) => answers.itemType === "link"
    },
    {
      type: "list",
      name: "itemColor",
      message: "Item Color:",
      choices: COLORS,
    },
    {
      type: "list",
      name: "itemIntensity",
      message: "Item Intensity:",
      choices: INTENSITIES.map(i => i.toString()),
      filter: (input: string) => parseInt(input, 10),
    },
    {
      type: "list",
      name: "itemHoverColor",
      message: "Hover Color:",
      choices: COLORS,
    },
    {
      type: "list",
      name: "itemHoverIntensity",
      message: "Hover Intensity:",
      choices: INTENSITIES.map(i => i.toString()),
      filter: (input: string) => parseInt(input, 10),
    },
    {
      type: "list",
      name: "itemActiveColor",
      message: "Active Color:",
      choices: COLORS,
    },
    {
      type: "list",
      name: "itemActiveIntensity",
      message: "Active Intensity:",
      choices: INTENSITIES.map(i => i.toString()),
      filter: (input: string) => parseInt(input, 10),
    },
    {
      type: "list",
      name: "itemEntranceAnimation",
      message: "Entrance Animation:",
      choices: ENTRANCE_ANIMATIONS,
    },
    {
      type: "list",
      name: "itemExitAnimation",
      message: "Exit Animation:",
      choices: EXIT_ANIMATIONS,
    },
  ]);

  return navItemAnswers;
}

async function addNavItemToJson(navItem: NavItem) {
  try {
    const navJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/navbar.json");
    let navArray: NavItem[] = [];

    try {
      const fileContent = await fs.readFile(navJsonPath, "utf-8");
      navArray = JSON.parse(fileContent);
      if (!Array.isArray(navArray)) {
        console.warn("navbar.json does not contain an array, initializing as empty array");
        navArray = [];
      }
    } catch (error) {
      console.log("navbar.json not found or invalid, creating new file with empty array");
      navArray = [];
    }

    navArray.push(navItem);

    await fs.writeFile(navJsonPath, JSON.stringify(navArray, null, 2), "utf-8");
    console.log(`✅ Successfully added navbar item "${navItem.itemName}" to navbar.json`);
  } catch (error) {
    console.error("❌ Error updating navbar.json:", error);
    throw error;
  }
}

export async function addNavbarCommand() {
  try {
    const answers = await promptNavItemInfo();
    const itemID = createGUID();
    const fullNavItem: NavItem = { ...answers, itemID };

    await addNavItemToJson(fullNavItem);

    console.log(`🎉 Successfully created new navbar item: ${fullNavItem.itemName}`);
  } catch (error) {
    console.error("❌ Error creating new navbar item:", error);
    process.exit(1);
  }
}
