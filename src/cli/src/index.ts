#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";

const program = new Command();

program
  .name("rkitech-cli")
  .description("Your CLI for Rkitech")
  .version("0.2.0");

program.action(async () => {
  console.log('this is the entry of the cli')
});

program.parse();
