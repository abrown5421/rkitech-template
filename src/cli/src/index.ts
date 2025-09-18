#!/usr/bin/env node
import { Command } from "commander";
import { newCommand } from "./commands/new/new.js";
import { editCommand } from "./commands/edit/edit.js";
import { deleteCommand } from "./commands/delete/delete.js";

const program = new Command();

program
  .name("rkitech-cli")
  .description("Your CLI for Rkitech")
  .version("0.1.0");

program
  .command("new")
  .description("Run this command to create a new page in your project")
  .action(async () => { 
    await newCommand();       
  });

program
  .command("edit")
  .description("Run this command to edit an existing page in your project")
  .action(async () => { 
    await editCommand();       
  });
  
program
  .command("delete")
  .description("Run this command to delete an existing page in your project")
  .action(async () => { 
    await deleteCommand();       
  });

program.parse();
