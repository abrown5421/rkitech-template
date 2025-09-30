import inquirer from "inquirer";
import { editTheme } from "./commands/editTheme.js";
import { viewTheme } from "./commands/viewTheme.js";
export async function themeManager() {
  let exit = false;
  while (!exit) {
    const { themeAction } = await inquirer.prompt([
      {
        type: "list",
        name: "themeAction",
        message: "Theme Menu - choose an action",
        choices: ["View Theme", "Edit Theme", "Back to Main Menu"]
      }
    ]);

    switch (themeAction) {
      case "View Theme":
        await viewTheme();
        break;
      case "Edit Theme":
        await editTheme();
        break;
      case "Back to Main Menu":
        exit = true;
        break;
    }
  }
}