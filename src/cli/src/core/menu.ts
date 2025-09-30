import { selectFromMenu } from "../shared/components/prompts.js";
import { showSection } from "../shared/components/messages.js";
import type { MenuItem, ModuleContext } from "./types.js";
import { createModuleContext, navigationStack } from "./navigation.js";
import { pagesModule } from "../features/pages/index.js";


const mainMenuItems: MenuItem[] = [
  {
    name: "Pages",
    value: "pages",
    description: "Create, edit, or delete pages",
  },
  {
    name: "Theme",
    value: "theme",
    description: "Customize theme and styling",
  },
  {
    name: "Exit CLI",
    value: "exit",
    description: "Exit the CLI",
  },
];

export async function showMainMenu(): Promise<void> {
  navigationStack.clear();

  while (true) {
    showSection("RKITECH CLI - Main Menu");

    const selection = await selectFromMenu(
      "What would you like to do?",
      mainMenuItems,
      false,
      false
    );

    if (selection === "exit") {
      console.log("\n👋 Thanks for using RKITECH CLI!\n");
      process.exit(0);
    }

    const context = createModuleContext(
      async () => await showMainMenu(),
      async () => await showMainMenu()
    );

    try {
      switch (selection) {
        case "pages":
          await pagesModule(context);
          break;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      await context.navigateToMain();
    }
  }
}