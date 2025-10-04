import inquirer from "inquirer";
import { newAsset } from "./commands/newAsset.js";
import { editAsset } from "./commands/editAsset.js";
import { deleteAsset } from "./commands/deleteAsset.js";

export async function assetManager() {
  let exit = false;
  while (!exit) {
    const { assetAction } = await inquirer.prompt([
      {
        type: "list",
        name: "assetAction",
        message: "Asset Menu - choose an action",
        choices: ["Add Asset", "Edit Asset", "Delete Asset", "Back to Main Menu"]
      }
    ]);

    switch (assetAction) {
      case "Add Asset":
        await newAsset();
        break;
      case "Edit Asset":
        await editAsset();
        break;
      case "Delete Asset":
        await deleteAsset();
        break;
      case "Back to Main Menu":
        exit = true;
        break;
    }
  }
}