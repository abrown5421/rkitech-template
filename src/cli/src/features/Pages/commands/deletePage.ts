import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../types/pageTypes.js';
import { formatFile } from '../../../shared/utils/formatFile.js';

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function deletePage() {
  const pagesJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Pages/json/pages.json'
  );

  try {
    await fs.access(pagesJsonPath);
  } catch (error) {
    console.error(`❌ Could not find pages.json at: ${pagesJsonPath}`);
    console.log('Please ensure the pages.json file exists in the correct location.');
    return;
  }

  let pages: PageData[];
  try {
    const pagesRaw = await fs.readFile(pagesJsonPath, 'utf-8');
    pages = JSON.parse(pagesRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing pages.json:', error);
    return;
  }

  if (pages.length === 0) {
    console.log('❌ No pages found to delete.');
    return;
  }

  const pageToDelete = await select({
    message: 'Select a page to delete:',
    choices: pages.map((page) => ({
      name: `${page.pageName} (${page.pagePath}) - ${page.pageRenderMethod}`,
      value: page.pageID,
    })),
  });

  const selectedPage = pages.find((p) => p.pageID === pageToDelete);
  if (!selectedPage) {
    console.error('❌ Selected page not found.');
    return;
  }

  const confirmDelete = await confirm({
    message: `Are you sure you want to delete "${selectedPage.pageName}"? This action cannot be undone.`,
    default: false,
  });

  if (!confirmDelete) {
    console.log('❌ Deletion cancelled.');
    return;
  }

  const pageName = selectedPage.pageName;
  const folderName = toCamelCase(pageName);

  const filteredPages = pages.filter((p) => p.pageID !== pageToDelete);

  try {
    const formattedPages = await prettier.format(JSON.stringify(filteredPages), {
      parser: 'json',
    });
    await fs.writeFile(pagesJsonPath, formattedPages, 'utf-8');
    
  } catch (error) {
    console.error('❌ Error writing to pages.json:', error);
    return;
  }

  if (selectedPage.pageRenderMethod === 'static') {
    const featuresDir = path.resolve(process.cwd(), 'src/features', folderName);

    try {
      await fs.access(featuresDir);
      
      await fs.rm(featuresDir, { recursive: true, force: true });
      
    } catch (error) {
      console.log(`ℹ️  Feature directory ${featuresDir} not found (this is normal for dynamic pages)`);
    }
    
    const pageShellPath = path.resolve(process.cwd(), 'src/features/PageShell/PageShell.tsx');

    try {
      let pageShellContent = await fs.readFile(pageShellPath, 'utf-8');

      const importPattern = new RegExp(
        `import ${pageName} from '../${folderName}/${pageName}';\\n?`,
        'g'
      );
      pageShellContent = pageShellContent.replace(importPattern, '');

      const renderPattern = new RegExp(
        `\\s*\\{activePage\\.activePageName === '${pageName}' && <${pageName} />\\}\\s*`,
        'g'
      );
      pageShellContent = pageShellContent.replace(renderPattern, '');

      await fs.writeFile(pageShellPath, pageShellContent, 'utf-8');

      formatFile(pageShellPath);

    } catch (error) {
      console.error('❌ Error updating PageShell:', error);
    }
  }

}