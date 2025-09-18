import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { COLORS, ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS, INTENSITIES } from '../constants/globalConstants.js';

export async function editPage() {
    const pagesJsonPath = path.join(process.cwd(), 'shared/json', 'pages.json');

    if (!fs.existsSync(pagesJsonPath)) {
        console.error('pages.json not found.');
        process.exit(1);
    }

    const pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));

    if (pages.length === 0) {
        console.log('No pages found in pages.json.');
        return;
    }

    const { pageGUID } = await inquirer.prompt([
        {
            type: 'list',
            name: 'pageGUID',
            message: 'Select a page to edit:',
            choices: pages.map(p => ({ name: p.pageName, value: p.guid }))
        }
    ]);

    const page = pages.find(p => p.guid === pageGUID);

    const { fieldToEdit } = await inquirer.prompt([
        {
            type: 'list',
            name: 'fieldToEdit',
            message: `What would you like to edit for '${page.pageName}'?`,
            choices: [
                'pageColor',
                'pageIntensity',
                'pageEntranceAnimation',
                'pageExitAnimation',
                'pagePath',
                'pageActive'
            ]
        }
    ]);

    let newValue;

    switch (fieldToEdit) {
        case 'pageColor':
            ({ newValue } = await inquirer.prompt([
                { type: 'list', name: 'newValue', message: 'Select a new color:', choices: COLORS }
            ]));
            break;
        case 'pageIntensity':
            ({ newValue } = await inquirer.prompt([
                { type: 'list', name: 'newValue', message: 'Select a new intensity:', choices: INTENSITIES }
            ]));
            break;
        case 'pageEntranceAnimation':
            ({ newValue } = await inquirer.prompt([
                { type: 'list', name: 'newValue', message: 'Select a new entrance animation:', choices: ENTRANCE_ANIMATIONS }
            ]));
            break;
        case 'pageExitAnimation':
            ({ newValue } = await inquirer.prompt([
                { type: 'list', name: 'newValue', message: 'Select a new exit animation:', choices: EXIT_ANIMATIONS }
            ]));
            break;
        case 'pagePath':
            ({ newValue } = await inquirer.prompt([
                { type: 'input', name: 'newValue', message: 'Enter the new page path:' }
            ]));
            break;
        case 'pageActive':
            ({ newValue } = await inquirer.prompt([
                { type: 'confirm', name: 'newValue', message: 'Should this page be active?', default: page.pageActive }
            ]));
            break;
        default:
            console.error('Unknown field selected.');
            return;
    }

    page[fieldToEdit] = newValue;
    fs.writeFileSync(pagesJsonPath, JSON.stringify(pages, null, 4));

    console.log(`Updated '${page.pageName}' → ${fieldToEdit}: ${newValue}`);
}
