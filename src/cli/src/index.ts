#!/usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";
import { showMainMenu } from "./core/menu.js";

async function main() {
  console.clear();
  console.log(chalk.cyan(figlet.textSync("RKITECH", { font: "Big" })));
  console.log(chalk.gray("Welcome to RKITECH CLI - Your Development Framework Assistant\n"));

  try {
    await showMainMenu();
  } catch (error) {
    console.error(chalk.red("Fatal error:"), error);
    process.exit(1);
  }
}

main();