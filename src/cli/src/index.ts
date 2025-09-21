#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";

import { newPageCommand } from "./commands/page/new/new.js";
import { editPageCommand } from "./commands/page/edit/edit.js";
import { deletePageCommand } from "./commands/page/delete/delete.js";
import { addNavbarCommand } from "./commands/navbar/add/add.js";
import { editNavbarCommand } from "./commands/navbar/edit/edit.js";
import { deleteNavbarCommand } from "./commands/navbar/delete/delete.js";

const program = new Command();

program
  .name("rkitech-cli")
  .description("Your CLI for Rkitech")
  .version("0.2.0");

program.action(async () => {
  // Step 1: Ask which category the user wants to work with
  const { category } = await inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: "What do you want to manage?",
      choices: [
        { name: "Pages", value: "pages" },
        { name: "Navbar", value: "navbar" },
        new inquirer.Separator(),
        { name: "Exit", value: "exit" }
      ]
    }
  ]);

  if (category === "exit") return;

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: `What do you want to do with ${category}?`,
      choices:
        category === "pages"
          ? [
              { name: "New Page", value: "new" },
              { name: "Edit Page", value: "edit" },
              { name: "Delete Page", value: "delete" }
            ]
          : [
              { name: "Add Navbar Item", value: "add" },
              { name: "Edit Navbar Item", value: "edit" },
              { name: "Delete Navbar Item", value: "delete" }
            ]
    }
  ]);

  if (category === "pages") {
    if (action === "new") await newPageCommand();
    if (action === "edit") await editPageCommand();
    if (action === "delete") await deletePageCommand();
  }

  if (category === "navbar") {
    if (action === "add") await addNavbarCommand();
    if (action === "edit") await editNavbarCommand();
    if (action === "delete") await deleteNavbarCommand();
  }
});

program.parse();
