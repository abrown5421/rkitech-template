import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

export async function deletePage() {
    const pagesJsonPath = path.join(process.cwd(), 'shared', 'pages.json');

    if (!fs.existsSync(pagesJsonPath)) return console.error('pages.json not found.');

    const pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));
    if (pages.length === 0) return console.log('No pages found.');

    const { pageName } = await inquirer.prompt([
        { type: 'list', name: 'pageName', message: 'Select a page to delete:', choices: pages.map(p => p.pageName) }
    ]);

    const { confirmDelete } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmDelete', message: `Delete '${pageName}'?`, default: false }
    ]);
    if (!confirmDelete) return console.log('Deletion cancelled.');

    const folderName = pageName[0].toLowerCase() + pageName.slice(1);
    const folderPath = path.join(process.cwd(), 'src/features', folderName);
    if (fs.existsSync(folderPath)) fs.rmSync(folderPath, { recursive: true, force: true });

    const filteredPages = pages.filter(p => p.pageName !== pageName);
    fs.writeFileSync(pagesJsonPath, JSON.stringify(filteredPages, null, 4));

    console.log(`Deleted '${pageName}' and removed from pages.json`);
}
