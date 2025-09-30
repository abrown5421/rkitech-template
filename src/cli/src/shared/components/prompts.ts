import inquirer from "inquirer";
import type { MenuItem } from "../../core/types.js";

export async function selectFromMenu(
  message: string,
  choices: MenuItem[],
  includeBack: boolean = true,
  includeMainMenu: boolean = true
): Promise<string> {
  const menuChoices = [...choices];

  if (includeBack) {
    menuChoices.push({
      name: "← Go Back",
      value: "back",
      description: "Return to previous menu",
    });
  }

  if (includeMainMenu) {
    menuChoices.push({
      name: "🏠 Main Menu",
      value: "main",
      description: "Return to main menu",
    });
  }

  const { selection } = await inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message,
      choices: menuChoices,
      pageSize: 15,
    },
  ]);

  return selection;
}

export async function confirmAction(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message,
      default: false,
    },
  ]);

  return confirmed;
}

export async function getTextInput(
  message: string,
  defaultValue?: string,
  validate?: (input: string) => boolean | string
): Promise<string> {
  const { input } = await inquirer.prompt([
    {
      type: "input",
      name: "input",
      message,
      default: defaultValue,
      validate,
    },
  ]);

  return input;
}