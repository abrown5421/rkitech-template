import inquirer from "inquirer";
import { initAuth } from "./commands/initAuth.js";
import { deactivateAuth } from "./commands/deactivateAuth.js";
import { newAuthUser } from "./commands/newAuthUser.js";
import { editAuthUser } from "./commands/editAuthUser.js";
import { deleteAuthUser } from "./commands/deleteAuthUser.js";

export async function authManager() {
    const { authAction } = await inquirer.prompt([
    {
      type: "list",
      name: "authAction",
      message: "Blog Menu - choose an action",
      choices: [
        "Manage Auth",
        "Deactivate Auth",
        "Manage Users",
        "Back to Main Menu"
      ]
    }
  ]);

  switch (authAction) {
    case "Manage Auth":
      await initAuth('manage');
      break;
    case "Deactivate Auth":
      await deactivateAuth();
      break;
    case "Manage Users":
      const { authUserAction } = await inquirer.prompt([
        {
          type: "list",
          name: "authUserAction", 
          message: "Auth Users - choose an action",
          choices: [
            "Add Auth User",
            "Edit Auth User",
            "Delete Auth User",
            "Back to Main Menu"
          ]
        }
      ]);

      switch (authUserAction) {
        case "Add Auth User":
          await newAuthUser();
          break;
        case "Edit Auth User":
          await editAuthUser();
          break;
        case "Delete Auth User":
          await deleteAuthUser();
          break;
        case "Back to Main Menu":
          break;
      }
      break;
    case "Back to Main Menu":
      return;
  }

  await authManager();
}