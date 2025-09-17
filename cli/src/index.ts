#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import camelCase from 'camelcase';
import { blankTemplate } from './templates/blank';

const args = process.argv.slice(2);
const command = args[0];
const pageNameArg = args[1];
const templateArgIndex = args.findIndex(arg => arg === '--template');
const templateName = templateArgIndex !== -1 ? args[templateArgIndex + 1] : 'two-column';

if (command === 'new-page' && pageNameArg) {
    const componentName = camelCase(pageNameArg, { pascalCase: true });
    const pageFolderName = camelCase(pageNameArg);

    const projectRoot = path.resolve(__dirname, '../../'); 
    const pagesDir = path.join(projectRoot, 'src', 'features', pageFolderName);

    if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
        console.log(`Created folder: ${pagesDir}`);
    }

    let templateContent = '';
    switch(templateName) {
        case 'two-column':
            templateContent = blankTemplate(componentName);
            break;
        default:
            console.error(`Template "${templateName}" not found`);
            process.exit(1);
    }

    const componentFilePath = path.join(pagesDir, `${componentName}.tsx`);
    fs.writeFileSync(componentFilePath, templateContent, { encoding: 'utf8' });
    console.log(`Created component: ${componentFilePath}`);
} else {
    console.log('Usage: new-page PageName --template two-column');
}
