import { input, select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../types/pageTypes.js';
import { COLORS, INTENSITIES, THEME_COLORS } from '../../../shared/constants/tailwindConstants.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { TEMPLATES } from '../../../shared/constants/templateConstants.js';
import { formatFile } from '../../../shared/utils/formatFile.js';
import { TailwindColor, TailwindIntensity, ThemeOptions } from 'rkitech-components';

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function editPage() {
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
  let pageColor: TailwindColor | ThemeOptions;
  let pageIntensity: TailwindIntensity | false;
  try {
    const pagesRaw = await fs.readFile(pagesJsonPath, 'utf-8');
    pages = JSON.parse(pagesRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing pages.json:', error);
    return;
  }

  if (pages.length === 0) {
    console.log('❌ No pages found to edit.');
    return;
  }

  const pageToEdit = await select({
    message: 'Select a page to edit:',
    choices: pages.map((page) => ({
      name: `${page.pageName} (${page.pagePath})`,
      value: page.pageID,
    })),
  });

  const selectedPage = pages.find((p) => p.pageID === pageToEdit);
  if (!selectedPage) {
    console.error('❌ Selected page not found.');
    return;
  }

  const originalPageName = selectedPage.pageName;
  const originalFolderName = toCamelCase(originalPageName);

  const newPageName = await input({
    message: 'Enter the page name:',
    default: selectedPage.pageName,
    validate: (input: string) => {
      if (!input) return 'Page name is required';
      if (input !== selectedPage.pageName && pages.some((p) => p.pageName === input)) {
        return 'Page name already exists';
      }
      return true;
    },
  });

  const newPagePath = await input({
    message: 'Enter the page path (without /, e.g., about):',
    default: selectedPage.pagePath.substring(1), 
    validate: (input: string) => {
      if (!input) return 'Path is required';
      if (input.includes('/')) return 'Do not include "/" — it will be added automatically';
      const formatted = `/${input}`;
      if (formatted !== selectedPage.pagePath && pages.some((p) => p.pagePath === formatted)) {
        return 'Page path already exists';
      }
      return true;
    },
  });

  const newPageRenderMethod = await select({
    message: 'Select render method:',
    choices: [
      { name: 'static', value: 'static' },
      { name: 'dynamic', value: 'dynamic' }
    ],
    default: selectedPage.pageRenderMethod,
  });

  let chosenTemplate: string | null = null;
  if (newPageRenderMethod === 'static') {
    chosenTemplate = await select({
      message: 'Select a template:',
      choices: Object.keys(TEMPLATES).map((tpl) => ({ name: tpl, value: tpl })),
    });
  }

  const newPageActive = await confirm({
    message: 'Should this page be active by default?',
    default: selectedPage.pageActive,
  });

  const colorType = await select({
    message: 'Select color type:',
    choices: [
      { name: 'Tailwind Color', value: 'tailwind' },
      { name: 'Theme Color', value: 'theme' }
    ],
  });

  if (colorType === 'tailwind') {
    pageColor = await select({
      message: 'Select a Tailwind color:',
      choices: COLORS.map((color) => ({ name: color, value: color })),
    });

    pageIntensity = await select({
      message: 'Select a page intensity:',
      choices: INTENSITIES.map((intensity) => ({
        name: intensity.toString(),
        value: intensity,
      })),
    });
  } else {
    pageColor = await select({
      message: 'Select a theme color:',
      choices: THEME_COLORS.map((color) => ({ name: color, value: color })),
    });
    
    pageIntensity = false; 
  }

  const newPageEntranceAnimation = await select({
    message: 'Select entrance animation:',
    choices: ENTRANCE_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
    default: selectedPage.pageEntranceAnimation,
  });

  const newPageExitAnimation = await select({
    message: 'Select exit animation:',
    choices: EXIT_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
    default: selectedPage.pageExitAnimation,
  });
  const updatedPageData: PageData = {
    ...selectedPage,
    pageName: newPageName,
    pagePath: `/${newPagePath}`,
    pageRenderMethod: newPageRenderMethod as 'static' | 'dynamic',
    pageActive: newPageActive,
    pageColor: pageColor,
    pageIntensity: pageIntensity,
    pageEntranceAnimation: newPageEntranceAnimation,
    pageExitAnimation: newPageExitAnimation,
  };

  const pageIndex = pages.findIndex((p) => p.pageID === pageToEdit);
  pages[pageIndex] = updatedPageData;

  try {
    const formattedPages = await prettier.format(JSON.stringify(pages), {
      parser: 'json',
    });
    await fs.writeFile(pagesJsonPath, formattedPages, 'utf-8');
  } catch (error) {
    console.error('❌ Error writing to pages.json:', error);
    return;
  }

  if (originalPageName !== newPageName && selectedPage.pageRenderMethod === 'static') {
    const oldFeaturesDir = path.resolve(process.cwd(), 'src/features', originalFolderName);
    const newFolderName = toCamelCase(newPageName);
    const newFeaturesDir = path.resolve(process.cwd(), 'src/features', newFolderName);

    try {
      await fs.access(oldFeaturesDir);

      await fs.mkdir(newFeaturesDir, { recursive: true });

      if (chosenTemplate) {
        const templateFn = TEMPLATES[chosenTemplate];
        const componentCode = templateFn(newPageName, newFolderName);
        const formattedCode = await prettier.format(componentCode, {
          parser: 'typescript',
        });

        await fs.writeFile(
          path.join(newFeaturesDir, `${newPageName}.tsx`),
          formattedCode,
          'utf-8'
        );

        const typeFileContent = `export interface ${newPageName}Props {
    
}
`;
        await fs.writeFile(
          path.join(newFeaturesDir, `${newFolderName}Types.ts`),
          typeFileContent,
          'utf-8'
        );
      }

      const pageShellPath = path.resolve(process.cwd(), 'src/features/PageShell/PageShell.tsx');
      let pageShellContent = await fs.readFile(pageShellPath, 'utf-8');

      const oldImportPattern = new RegExp(`import ${originalPageName} from '../${originalFolderName}/${originalPageName}';\\n?`, 'g');
      const oldRenderPattern = new RegExp(`\\s*\\{activePage\\.activePageName === '${originalPageName}' && <${originalPageName} />\\}\\s*`, 'g');
      
      pageShellContent = pageShellContent.replace(oldImportPattern, '');
      pageShellContent = pageShellContent.replace(oldRenderPattern, '');

      const newImportStatement = `import ${newPageName} from '../${newFolderName}/${newPageName}';`;
      if (!pageShellContent.includes(newImportStatement)) {
        pageShellContent = pageShellContent.replace(
          /(import React.*;)/,
          `$1\n${newImportStatement}`
        );
      }

      const newRenderSnippet = `{activePage.activePageName === '${newPageName}' && <${newPageName} />} `;
      
      const insertPosition = pageShellContent.indexOf(`{activePage.activePageName === 'PageNotFound' && <PageNotFound />}`);
      if (insertPosition !== -1) {
        const beforeInsert = pageShellContent.substring(0, insertPosition);
        const afterInsert = pageShellContent.substring(insertPosition);
        pageShellContent = beforeInsert + newRenderSnippet + '\n      ' + afterInsert;
      } else {
        pageShellContent = pageShellContent.replace(
          /(\{\s*'\s*'\s*\})/,
          `      ${newRenderSnippet}\n$1`
        );
      }

      await fs.writeFile(pageShellPath, pageShellContent, 'utf-8');

      await fs.rm(oldFeaturesDir, { recursive: true, force: true });

      console.log(`✅ Feature renamed from ${originalFolderName} to ${newFolderName}`);
      console.log(`✅ PageShell updated with ${newPageName}`);

      formatFile(pageShellPath);

    } catch (error) {
      console.error('❌ Error updating feature files:', error);
    }
  } else if (newPageRenderMethod === 'static' && chosenTemplate && selectedPage.pageRenderMethod !== 'static') {
    const newFolderName = toCamelCase(newPageName);
    const newFeaturesDir = path.resolve(process.cwd(), 'src/features', newFolderName);

    try {
      await fs.mkdir(newFeaturesDir, { recursive: true });

      const templateFn = TEMPLATES[chosenTemplate];
      const componentCode = templateFn(newPageName, newFolderName);
      const formattedCode = await prettier.format(componentCode, {
        parser: 'typescript',
      });

      await fs.writeFile(
        path.join(newFeaturesDir, `${newPageName}.tsx`),
        formattedCode,
        'utf-8'
      );

      const typeFileContent = `export interface ${newPageName}Props {
    
}
`;
      await fs.writeFile(
        path.join(newFeaturesDir, `${newFolderName}Types.ts`),
        typeFileContent,
        'utf-8'
      );

      const pageShellPath = path.resolve(process.cwd(), 'src/features/PageShell/PageShell.tsx');
      let pageShellContent = await fs.readFile(pageShellPath, 'utf-8');

      const importStatement = `import ${newPageName} from '../${newFolderName}/${newPageName}';`;
      if (!pageShellContent.includes(importStatement)) {
        pageShellContent = pageShellContent.replace(
          /(import React.*;)/,
          `$1\n${importStatement}`
        );
      }

      const renderSnippet = `{activePage.activePageName === '${newPageName}' && <${newPageName} />} `;
      
      const insertPosition = pageShellContent.indexOf(`{activePage.activePageName === 'PageNotFound' && <PageNotFound />}`);
      if (insertPosition !== -1) {
        const beforeInsert = pageShellContent.substring(0, insertPosition);
        const afterInsert = pageShellContent.substring(insertPosition);
        pageShellContent = beforeInsert + renderSnippet + '\n      ' + afterInsert;
      } else {
        pageShellContent = pageShellContent.replace(
          /(\{\s*'\s*'\s*\})/,
          `      ${renderSnippet}\n$1`
        );
      }

      await fs.writeFile(pageShellPath, pageShellContent, 'utf-8');

      formatFile(pageShellPath);

    } catch (error) {
      console.error('❌ Error generating template files:', error);
    }
  }

}