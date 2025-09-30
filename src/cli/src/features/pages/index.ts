import { selectFromMenu } from "../../shared/components/prompts.js";
import { showSection, showInfo } from "../../shared/components/messages.js";
import type { ModuleContext, MenuItem } from "../../core/types.js";
import { createPage } from "./commands/createPage.js";
import { editPage } from "./commands/editPage.js";
import { deletePage } from "./commands/deletePage.js";

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
  showSection("Pages Management");

  const selection = await selectFromMenu(
    "Choose a pages action:",
    [
      { name: "Create New Page", value: "create" },
      { name: "Edit Existing Page", value: "edit" },
      { name: "Delete Page", value: "delete" }
    ]
  );

  switch (selection) {
    case "create":
      await createPage(); 
      break;
    case "edit":
      await editPage();
      break;
    case "delete":
      await deletePage();
      break;
  }

  const postAction = await selectFromMenu(
    "What would you like to do next?",
    [
      { name: "Go Back", value: "back" },
      { name: "Main Menu", value: "main" },
    ]
  );

  if (postAction === "back") {
    await context.navigateBack();
  } else {
    await context.navigateToMain();
  }
}