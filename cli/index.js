#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { blankTemplate } from './templates/blank'; 

const args = process.argv.slice(2);
const command = args[0];

const COLORS = [
  'red','orange','amber','yellow','lime','green','emerald',
  'teal','cyan','sky','blue','indigo','violet','purple',
  'fuchsia','pink','rose','slate','gray','zinc','neutral','stone'
];

const INTENSITIES = ['50','100','200','300','400','500','600','700','800','900','950'];

const ENTRANCE_ANIMATIONS = [
  "animate__backInDown","animate__backInLeft","animate__backInRight","animate__backInUp",
  "animate__bounceIn","animate__bounceInDown","animate__bounceInLeft","animate__bounceInRight",
  "animate__bounceInUp","animate__fadeIn","animate__fadeInDown","animate__fadeInDownBig",
  "animate__fadeInLeft","animate__fadeInLeftBig","animate__fadeInRight","animate__fadeInRightBig",
  "animate__fadeInUp","animate__fadeInUpBig","animate__fadeInTopLeft","animate__fadeInTopRight",
  "animate__fadeInBottomLeft","animate__fadeInBottomRight","animate__flipInX","animate__flipInY",
  "animate__lightSpeedInRight","animate__lightSpeedInLeft","animate__rotateIn","animate__rotateInDownLeft",
  "animate__rotateInDownRight","animate__rotateInUpLeft","animate__rotateInUpRight","animate__jackInTheBox",
  "animate__rollIn","animate__zoomIn","animate__zoomInDown","animate__zoomInLeft","animate__zoomInRight",
  "animate__zoomInUp","animate__slideInDown","animate__slideInLeft","animate__slideInRight","animate__slideInUp"
];

const EXIT_ANIMATIONS = [
  "animate__backOutDown","animate__backOutLeft","animate__backOutRight","animate__backOutUp",
  "animate__bounceOut","animate__bounceOutDown","animate__bounceOutLeft","animate__bounceOutRight",
  "animate__bounceOutUp","animate__fadeOut","animate__fadeOutDown","animate__fadeOutDownBig",
  "animate__fadeOutLeft","animate__fadeOutLeftBig","animate__fadeOutRight","animate__fadeOutRightBig",
  "animate__fadeOutUp","animate__fadeOutUpBig","animate__fadeOutTopLeft","animate__fadeOutTopRight",
  "animate__fadeOutBottomRight","animate__fadeOutBottomLeft","animate__flipOutX","animate__flipOutY",
  "animate__lightSpeedOutRight","animate__lightSpeedOutLeft","animate__rotateOut","animate__rotateOutDownLeft",
  "animate__rotateOutDownRight","animate__rotateOutUpLeft","animate__rotateOutUpRight","animate__rollOut",
  "animate__zoomOut","animate__zoomOutDown","animate__zoomOutLeft","animate__zoomOutRight","animate__zoomOutUp",
  "animate__slideOutDown","animate__slideOutLeft","animate__slideOutRight","animate__slideOutUp"
];

async function promptPageInfo() {
  return inquirer.prompt([
    { type: 'input', name: 'pageName', message: 'Page Name:' },
    { type: 'input', name: 'pagePath', message: 'Page Path (e.g. /my-page):' },
    { type: 'list', name: 'pageRenderMethod', message: 'Page Render Method:', choices: ['static', 'dynamic'] },
    { type: 'confirm', name: 'pageActive', message: 'Set page as active?', default: false },
    { type: 'list', name: 'pageColor', message: 'Page Color:', choices: COLORS },
    { type: 'list', name: 'pageIntensity', message: 'Page Intensity:', choices: INTENSITIES },
    { type: 'list', name: 'pageEntranceAnimation', message: 'Entrance Animation:', choices: ENTRANCE_ANIMATIONS },
    { type: 'list', name: 'pageExitAnimation', message: 'Exit Animation:', choices: EXIT_ANIMATIONS }
  ]);
}

async function createPage() {
  const answers = await promptPageInfo();
  
  const folderName = answers.pageName[0].toLowerCase() + answers.pageName.slice(1); 
  const folderPath = path.join(process.cwd(), 'features', folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const pageFile = path.join(folderPath, `${answers.pageName}.tsx`); 
  const typesFile = path.join(folderPath, `${folderName}Types.ts`); 

  fs.writeFileSync(pageFile, blankTemplate(answers.pageName, folderName));
  fs.writeFileSync(typesFile, `export interface ${answers.pageName}Props {}\n`);

  const pagesJsonPath = path.join(process.cwd(), 'shared', 'pages.json');
  const pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));

  pages.push({
    pageName: answers.pageName,
    pagePath: answers.pagePath,
    pageRenderMethod: answers.pageRenderMethod,
    pageActive: answers.pageActive,
    pageColor: answers.pageColor,
    pageIntensity: answers.pageIntensity,
    pageEntranceAnimation: answers.pageEntranceAnimation,
    pageExitAnimation: answers.pageExitAnimation,
    pageContent: ""
  });

  fs.writeFileSync(pagesJsonPath, JSON.stringify(pages, null, 4));
  console.log(`Page ${answers.pageName} created at ${folderPath} with path '${answers.pagePath}'`);
}

if (command === 'new-page') {
  createPage();
}
