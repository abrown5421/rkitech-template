import inquirer from "inquirer";
import { newMenuItem } from "./commands/newMenuItem.js";
import { editMenuItem } from "./commands/editsMenuItem.js";
import { deleteMenuItem } from "./commands/deleteMenuItem.js";
import { editNavbar } from "./commands/editNavbar.js";

export async function navbarManager() {
  const { navbarAction } = await inquirer.prompt([
    {
      type: "list",
      name: "navbarAction",
      message: "Navbar Menu - choose an action",
      choices: [
        "Manage Navbar",
        "Manage Navbar Menu",
        "Back to Main Menu"
      ]
    }
  ]);

  switch (navbarAction) {
    case "Manage Navbar":
      await editNavbar();
      break;
    case "Manage Navbar Menu":
      const { navbarMenuAction } = await inquirer.prompt([
        {
          type: "list",
          name: "navbarMenuAction", 
          message: "Navbar Menu - choose an action",
          choices: [
            "Add Menu Item",
            "Edit Menu Item",
            "Delete Menu Item",
            "Back to Main Menu"
          ]
        }
      ]);

      switch (navbarMenuAction) {
        case "Add Menu Item":
          await newMenuItem();
          break;
        case "Edit Menu Item":
          await editMenuItem();
          break;
        case "Delete Menu Item":
          await deleteMenuItem();
          break;
        case "Back to Main Menu":
          break;
      }
      break;
    case "Back to Main Menu":
      return;
  }

  await navbarManager();
}
