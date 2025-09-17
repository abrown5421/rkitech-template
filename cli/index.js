#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import kebabCase from 'lodash.kebabcase'; 
import { twoColumnTemplate } from './templates/two-column';

const args = process.argv.slice(2);
const command = args[0];
const pageName = args[1]; 

if (command === 'new-page' && pageName) {
    const folderName = pageName[0].toLowerCase() + pageName.slice(1); 
    const folderPath = path.join(process.cwd(), 'features', folderName);
    
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const pageFile = path.join(folderPath, `${pageName}.tsx`); 
    const typesFile = path.join(folderPath, `${folderName}Types.ts`); 

    fs.writeFileSync(pageFile, twoColumnTemplate(pageName));
    fs.writeFileSync(typesFile, `export interface ${pageName}Props {}\n`);

    const pagePath = kebabCase(pageName); 

    const pagesJsonPath = path.join(process.cwd(), 'shared', 'pages.json');
    const pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));

    pages.push({
        pageName,
        pagePath,              
        pageActive: false,
        pageColor: "",
        pageEntranceAnimation: "",
        pageExitAnimation: "",
        pageContent: ""
    });

    fs.writeFileSync(pagesJsonPath, JSON.stringify(pages, null, 4));
    console.log(`Page ${pageName} created at ${folderPath} with path '${pagePath}'`);
}
