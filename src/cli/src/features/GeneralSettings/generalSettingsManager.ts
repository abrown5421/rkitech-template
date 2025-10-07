import inquirer from "inquirer";
import { themeManager } from "../Theme/themeManager.js";
import { changeFile } from "./commands/changeFile.js";

export async function generalSettingsManager() {
  let exit = false;
  while (!exit) {
    const { generalSettingsAction } = await inquirer.prompt([
      {
        type: "list",
        name: "generalSettingsAction",
        message: "Pages Menu - choose an action",
        choices: ["Change Logo", "Primary Font", "Secondary Font", "Manage Theme", "Back to Main Menu"]
      }
    ]);

    switch (generalSettingsAction) {
      case "Change Logo":
        await changeFile("Logo", 'image');
        break;
      case "Primary Font":
        await changeFile("Primary", 'font');
        break;
      case "Secondary Font":
        await changeFile("Secondary", 'font');
        break;
      case "Manage Theme":
        await themeManager();
        break;
      case "Back to Main Menu":
        exit = true;
        break;
    }
  }
}