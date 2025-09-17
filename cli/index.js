#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import camelCase from 'camelcase';
import { blankTemplate } from './templates/blank.js';

import { program } from 'commander';

program
  .command('new-page <componentName>')
  .option('--template <templateName>', 'Template to use', 'blank')
  .action((componentName, options) => {
    const componentNamePascal = camelCase(componentName, { pascalCase: true }); 
    const folderName = camelCase(componentName); 

    const templateName = options.template;

    const templateMap = {
      blank: blankTemplate,
    };

    const templateFn = templateMap[templateName];
    if (!templateFn) {
      console.error(`Template "${templateName}" not found.`);
      process.exit(1);
    }

    const folderPath = path.join(process.cwd(), 'src/features', folderName);
    fs.ensureDirSync(folderPath);

    const componentFilePath = path.join(folderPath, `${componentNamePascal}.tsx`);
    const componentContent = templateFn(componentNamePascal, folderName);
    fs.writeFileSync(componentFilePath, componentContent);

    const typesFilePath = path.join(folderPath, `${folderName}Types.ts`);
    const typesContent = `export interface ${componentNamePascal}Props {\n  // add props here\n}\n`;
    fs.writeFileSync(typesFilePath, typesContent);

    console.log(`✅ Created page at ${componentFilePath}`);
    console.log(`✅ Created types file at ${typesFilePath}`);
  });


program.parse(process.argv);
