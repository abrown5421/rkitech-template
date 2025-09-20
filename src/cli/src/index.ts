#!/usr/bin/env node
import { Command } from "commander";
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
  .version("0.1.0");

program
  .command("new-page")
  .description("Run this command to create a new page in your project")
  .action(async () => { 
    await newPageCommand();       
  });

program
  .command("edit-page")
  .description("Run this command to edit an existing page in your project")
  .action(async () => { 
    await editPageCommand();       
  });
  
program
  .command("delete-page")
  .description("Run this command to delete an existing page in your project")
  .action(async () => { 
    await deletePageCommand();       
  });

program
  .command("add-nav")
  .description("Run this command to add items to the navbar")
  .action(async () => { 
    await addNavbarCommand();       
  });

program
  .command("edit-nav")
  .description("Run this command to edit existing items in the navbar")
  .action(async () => { 
    await editNavbarCommand();       
  });
  
program
  .command("delete-nav")
  .description("Run this command to delete an existing item in the navbar")
  .action(async () => { 
    await deleteNavbarCommand();       
  });

program.parse();
