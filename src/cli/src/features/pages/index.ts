import { selectFromMenu } from "../../shared/components/prompts.js";
import { showSection, showInfo } from "../../shared/components/messages.js";
import type { ModuleContext, MenuItem } from "../../core/types.js";

const pagesMenuItems: MenuItem[] = [
  {
    name: "Create New Page",
    value: "create",
    description: "Create a new page from template",
  },
  {
    name: "Edit Existing Page",
    value: "edit",
    description: "Modify an existing page",
  },
  {
    name: "Delete Page",
    value: "delete",
    description: "Remove a page from your project",
  },
];

export async function pagesModule(context: ModuleContext): Promise<void> {
  while (true) {
    showSection("Pages Management");

    const selection = await selectFromMenu(
      "Choose a pages action:",
      pagesMenuItems
    );

    if (selection === "back" || selection === "main") {
      if (selection === "back") {
        await context.navigateBack();
      } else {
        await context.navigateToMain();
      }
      return;
    }

    switch (selection) {
      case "create":
        showInfo("Create page feature - Coming soon!");
        break;
      case "edit":
        showInfo("Edit page feature - Coming soon!");
        break;
      case "delete":
        showInfo("Delete page feature - Coming soon!");
        break;
    }

    console.log();
  }
}