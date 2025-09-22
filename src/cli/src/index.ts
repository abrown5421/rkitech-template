#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import inquirer from "inquirer";
import { pageManager } from "./features/Pages/pageManager.js";
import { navbarManager } from "./features/Navbar/navbarManager.js";

const program = new Command();

program
  .name("rkitech-cli")
  .description("Your CLI for Rkitech")
  .version("0.2.0");

async function mainMenu() {
  while (true) {
    console.clear();
    console.log(figlet.textSync("RKITECH", { font: "Big" }));
    console.log("Welcome to RKITECH CLI!\n");

    const { mainChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "mainChoice",
        message: "What would you like to do?",
        choices: ["Manage Pages", "Manage Navbar", "Exit"]
      }
    ]);

    switch (mainChoice) {
      case "Manage Pages":
        await pageManager();
        break;
      case "Manage Navbar":
        await navbarManager();
        break;
      case "Exit":
        console.log("Goodbye!");
        process.exit(0);
    }
  }
}

program.action(async () => {
  await mainMenu();
});

program.parse();
