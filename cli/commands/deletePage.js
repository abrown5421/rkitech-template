import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

function removePageFromPageShell(pageName) {
    const folderName = pageName[0].toLowerCase() + pageName.slice(1); 
    const pageShellPath = path.join(process.cwd(), 'src/features/pageShell/PageShell.tsx');

    if (!fs.existsSync(pageShellPath)) return;

    let fileContent = fs.readFileSync(pageShellPath, 'utf-8');

    const importRegex = new RegExp(`import ${pageName} from '\\.\\./${folderName}/${pageName}';\\n?`, 'g');
    fileContent = fileContent.replace(importRegex, '');

    const renderRegex = new RegExp(`\\s*\\{activePage\\.activePageName === '${pageName}' && <${pageName} />\\}\\n?`, 'g');
    fileContent = fileContent.replace(renderRegex, '');

    fs.writeFileSync(pageShellPath, fileContent, 'utf-8');
    console.log(`Removed ${pageName} from PageShell.tsx`);
}

export async function deletePage() {
    const pagesJsonPath = path.join(process.cwd(), 'shared/json', 'pages.json');

    if (!fs.existsSync(pagesJsonPath)) return console.error('pages.json not found.');

    const pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));
    if (pages.length === 0) return console.log('No pages found.');

    const { pageGUID } = await inquirer.prompt([
        {
            type: 'list',
            name: 'pageGUID',
            message: 'Select a page to delete:',
            choices: pages.map(p => ({ name: p.pageName, value: p.guid }))
        }
    ]);

    const pageToDelete = pages.find(p => p.guid === pageGUID);

    if (!pageToDelete) return console.error('Page not found.');

    const { confirmDelete } = await inquirer.prompt([
        { 
            type: 'confirm', 
            name: 'confirmDelete', 
            message: `Delete '${pageToDelete.pageName}'?`, 
            default: false 
        }
    ]);
    if (!confirmDelete) return console.log('Deletion cancelled.');

    const folderName = pageToDelete.pageName[0].toLowerCase() + pageToDelete.pageName.slice(1);
    const folderPath = path.join(process.cwd(), 'src/features', folderName);
    if (fs.existsSync(folderPath)) fs.rmSync(folderPath, { recursive: true, force: true });

    const filteredPages = pages.filter(p => p.guid !== pageGUID);
    fs.writeFileSync(pagesJsonPath, JSON.stringify(filteredPages, null, 4));

    removePageFromPageShell(pageToDelete.pageName); 

    console.log(`Deleted '${pageToDelete.pageName}', removed from pages.json and PageShell.tsx`);
}
