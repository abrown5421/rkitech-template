import inquirer from "inquirer";
import { editFooter } from "./commands/editFooter.js";
import { newMenuItem } from "./commands/newMenuItem.js";
import { editMenuItem } from "./commands/editMenuItem.js";
import { deleteMenuItem } from "./commands/deleteMenuItem.js";

export async function footerManager() {
  const { footerAction } = await inquirer.prompt([
    {
      type: "list",
      name: "footerAction",
      message: "Footer Menu - choose an action",
      choices: [
        "Manage Footer",
        "Manage Footer Main Menu",
        "Manage Footer Auxilary Menu",
        "Back to Main Menu"
      ]
    }
  ]);

  switch (footerAction) {
    case "Manage Footer":
      await editFooter();
      break;
    case "Manage Footer Main Menu":
      const { footerMainMenuAction } = await inquirer.prompt([
        {
          type: "list",
          name: "footerMainMenuAction", 
          message: "Footer Main Menu - choose an action",
          choices: [
            "Add Menu Item",
            "Edit Menu Item",
            "Delete Menu Item",
            "Back to Footer Menu"
          ]
        }
      ]);

      switch (footerMainMenuAction) {
        case "Add Menu Item":
          await newMenuItem('main');
          break;
        case "Edit Menu Item":
          await editMenuItem('main');
          break;
        case "Delete Menu Item":
          await deleteMenuItem('main');
          break;
        case "Back to Main Menu":
          break;
      }
      break;
    
    case "Manage Footer Auxilary Menu":
      const { footerAuxMenuAction } = await inquirer.prompt([
        {
          type: "list",
          name: "footerAuxMenuAction", 
          message: "Footer Auxilary Menu - choose an action",
          choices: [
            "Add Menu Item",
            "Edit Menu Item",
            "Delete Menu Item",
            "Back to Footer Menu"
          ]
        }
      ]);

      switch (footerAuxMenuAction) {
        case "Add Menu Item":
          await newMenuItem('aux');
          break;
        case "Edit Menu Item":
          await editMenuItem('aux');
          break;
        case "Delete Menu Item":
          await deleteMenuItem('aux');
          break;
        case "Back to Main Menu":
          break;
      }
      break;
      
    case "Back to Main Menu":
      return;
  }

  await footerManager();
}
