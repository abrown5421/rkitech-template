#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import fs from 'fs/promises';
import path from 'path';
import inquirer from "inquirer";
import { pageManager } from "./features/Pages/pageManager.js";
import { navbarManager } from "./features/Navbar/navbarManager.js";
import { footerManager } from "./features/Footer/footerManager.js";
import { BlogConfig } from "./features/Blog/types/blogTypes.js";
import { blogManager } from "./features/Blog/blogManager.js";
import { initBlog } from "./features/Blog/commands/initBlog.js";
import { themeManager } from "./features/Theme/themeManager.js";
import { assetManager } from "./features/Assets/assetManager.js";

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

    const blogJsonPath = path.resolve(
      process.cwd(),
      'src/cli/src/features/Blog/json/blog.json'
    );


    try {
      await fs.access(blogJsonPath);
    } catch (error) {
      console.error(`❌ Could not find navbar.json at: ${blogJsonPath}`);
      console.log('Please ensure the navbar.json file exists in the correct location.');
      return;
    }

    let blog: BlogConfig;

    try {
      const blogRaw = await fs.readFile(blogJsonPath, 'utf-8');
      blog = JSON.parse(blogRaw);
    } catch (error) {
      console.error('❌ Error reading or parsing navbar.json:', error);
      return;
    }

    const { mainChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "mainChoice",
        message: "What would you like to do?",
        choices: ["Manage Assets", "Manage Theme", "Manage Pages", "Manage Navbar", "Manage Footer", (blog.blogActive ? "Manage Blog" : "Create Blog"), "Exit"]
      }
    ]);

    switch (mainChoice) {
      case "Manage Assets":
        await assetManager();
        break;
      case "Manage Theme":
        await themeManager();
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
      case "Create Blog":
        await initBlog('new');
        break;
      case "Manage Blog":
        await blogManager();
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
