import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { blankTemplate } from '../templates/blank.js';
import { COLORS, ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS, INTENSITIES } from '../constants/globalConstants.js';
import { createGUID } from '../../shared/utils/createGUID.js';

function addPageToPageShell(pageName) {
    const folderName = pageName[0].toLowerCase() + pageName.slice(1); 
    const pageShellPath = path.join(process.cwd(), 'src/features/pageShell/PageShell.tsx');
    let fileContent = fs.readFileSync(pageShellPath, 'utf-8');

    const importStatement = `import ${pageName} from '../${folderName}/${pageName}';\n`;
    if (!fileContent.includes(importStatement)) {
        const lastImportIndex = fileContent.lastIndexOf('import ');
        const nextLineIndex = fileContent.indexOf('\n', lastImportIndex) + 1;
        fileContent = fileContent.slice(0, nextLineIndex) + importStatement + fileContent.slice(nextLineIndex);
    }

    const containerTag = '<Container';
    const containerIndex = fileContent.indexOf(containerTag);
    if (containerIndex !== -1) {
        const closingTagIndex = fileContent.indexOf('>', containerIndex) + 1;
        const renderStatement = `\n            {activePage.activePageName === '${pageName}' && <${pageName} />}\n`;
        if (!fileContent.includes(renderStatement)) {
            fileContent = fileContent.slice(0, closingTagIndex) + renderStatement + fileContent.slice(closingTagIndex);
        }
    }

    fs.writeFileSync(pageShellPath, fileContent, 'utf-8');
    console.log(`PageShell.tsx updated with ${pageName}`);
}

async function promptPageInfo() {
    return inquirer.prompt([
        { type: 'input', name: 'pageName', message: 'Page Name:' },
        { 
            type: 'input', 
            name: 'pagePath', 
            message: 'Page Path (e.g. my-page):',
            filter: input => {
                if (!input.startsWith('/')) {
                    return '/' + input;
                }
                return input;
            }
        },
        { type: 'list', name: 'pageRenderMethod', message: 'Page Render Method:', choices: ['static', 'dynamic'] },
        { type: 'confirm', name: 'pageActive', message: 'Set page as active?', default: false },
        { type: 'list', name: 'pageColor', message: 'Page Color:', choices: COLORS },
        { type: 'list', name: 'pageIntensity', message: 'Page Intensity:', choices: INTENSITIES },
        { type: 'list', name: 'pageEntranceAnimation', message: 'Entrance Animation:', choices: ENTRANCE_ANIMATIONS },
        { type: 'list', name: 'pageExitAnimation', message: 'Exit Animation:', choices: EXIT_ANIMATIONS }
    ]);
}


export async function createPage() {
    const answers = await promptPageInfo();
    const folderName = answers.pageName[0].toLowerCase() + answers.pageName.slice(1); 
    const folderPath = path.join(process.cwd(), 'src/features', folderName);

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    fs.writeFileSync(path.join(folderPath, `${answers.pageName}.tsx`), blankTemplate(answers.pageName, folderName));
    fs.writeFileSync(path.join(folderPath, `${folderName}Types.ts`), `export interface ${answers.pageName}Props {}\n`);

    const pagesJsonPath = path.join(process.cwd(), 'shared/json', 'pages.json');
    const pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));
    const newPageGUID = createGUID()
    pages.push({ ...answers, pageContent: "", pageID: newPageGUID });
    fs.writeFileSync(pagesJsonPath, JSON.stringify(pages, null, 4));
    
    addPageToPageShell(answers.pageName);

    console.log(`Page ${answers.pageName} created at ${folderPath}`);
}
