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
import { assetManager } from "./features/Assets/assetManager.js";
import { generalSettingsManager } from "./features/GeneralSettings/generalSettingsManager.js";
import { initAuth } from "./features/Auth/commands/initAuth.js";
import { authManager } from "./features/Auth/authManager.js";
import { AuthConfig } from "./features/Auth/types/authTypes.js";

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

    const authJsonPath = path.resolve(
      process.cwd(),
      'src/cli/src/features/Auth/json/auth.json'
    );


    try {
      await fs.access(authJsonPath);
    } catch (error) {
      console.error(`❌ Could not find navbar.json at: ${authJsonPath}`);
      console.log('Please ensure the navbar.json file exists in the correct location.');
      return;
    }

    let blog: BlogConfig;
    let auth: AuthConfig;

    try {
      const blogRaw = await fs.readFile(blogJsonPath, 'utf-8');
      blog = JSON.parse(blogRaw);
    } catch (error) {
      console.error('❌ Error reading or parsing navbar.json:', error);
      return;
    }

    try {
      const authRaw = await fs.readFile(authJsonPath, 'utf-8');
      auth = JSON.parse(authRaw);
    } catch (error) {
      console.error('❌ Error reading or parsing navbar.json:', error);
      return;
    }

    const { mainChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "mainChoice",
        message: "What would you like to do?",
        choices: ["General Settings", "Manage Assets", "Manage Pages", "Manage Navbar", "Manage Footer", (auth.authActive ? "Manage Auth" : "Create Auth"), (blog.blogActive ? "Manage Blog" : "Create Blog"), "Exit"]
      }
    ]);

    switch (mainChoice) {
      case "General Settings":
        await generalSettingsManager();
        break;
      case "Manage Assets":
        await assetManager();
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
      case "Create Auth":
        await initAuth('new');
        break;
      case "Manage Auth":
        await authManager();
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
