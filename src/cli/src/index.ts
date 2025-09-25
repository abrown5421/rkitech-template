#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import inquirer from "inquirer";
import { pageManager } from "./features/Pages/pageManager.js";
import { navbarManager } from "./features/Navbar/navbarManager.js";
import { footerManager } from "./features/Footer/footerManager.js";
import { editTheme } from "./features/Theme/commands/editTheme.js";

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
        choices: ["Manage Theme", "Manage Pages", "Manage Navbar", "Manage Footer", "Exit"]
      }
    ]);

    switch (mainChoice) {
      case "Manage Theme":
        await editTheme();
        break;
      case "Manage Pages":
        await pageManager();
        break;
      case "Manage Navbar":
        await navbarManager();
        break;
      case "Manage Footer":
        await footerManager();
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
