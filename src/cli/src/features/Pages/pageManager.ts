import inquirer from "inquirer";
import { newPage } from "./commands/newPage.js";
import { editPage } from "./commands/editPage.js";
import { deletePage } from "./commands/deletePage.js";

export async function pageManager() {
  let exit = false;
  while (!exit) {
    const { pageAction } = await inquirer.prompt([
      {
        type: "list",
        name: "pageAction",
        message: "Pages Menu - choose an action",
        choices: ["Add Page", "Edit Page", "Delete Page", "Back to Main Menu"]
      }
    ]);

    switch (pageAction) {
      case "Add Page":
        await newPage();
        break;
      case "Edit Page":
        await editPage();
        break;
      case "Delete Page":
        await deletePage();
        break;
      case "Back to Main Menu":
        exit = true;
        break;
    }
  }
}