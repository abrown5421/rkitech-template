import { input, select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { EditPageOptions, PageData } from '../types/pageTypes.js';
import { COLORS, INTENSITIES, THEME_COLORS } from '../../../shared/constants/tailwindConstants.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { TEMPLATES } from '../../../shared/constants/templateConstants.js';
import { formatFile } from '../../../shared/utils/formatFile.js';
import { getJsonTemplate } from '../../../shared/utils/getJsonTemplate.js';
import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity, ThemeOptions } from 'rkitech-components';

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function editPage(options?: EditPageOptions): Promise<string | undefined> {
  const {
    pageID: optPageID,
    pageName: optName,
    pagePath: optPath,
    pageRenderMethod: optRender,
    pageActive: optActive,
    pageColor: optColor,
    pageIntensity: optIntensity,
    pageEntranceAnimation: optEntrance,
    pageExitAnimation: optExit,
    chosenTemplate: optTemplate,
    skipPrompts
  } = options || {};

  const excludeFromRenaming = ['Home', 'Blog'];

  const pagesJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Pages/json/pages.json'
  );

  try {
    await fs.access(pagesJsonPath);
  } catch (error) {
    console.error(`❌ Could not find pages.json at: ${pagesJsonPath}`);
    console.log('Please ensure the pages.json file exists in the correct location.');
    return undefined;
  }

  let pages: PageData[];
  try {
    const pagesRaw = await fs.readFile(pagesJsonPath, 'utf-8');
    pages = JSON.parse(pagesRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing pages.json:', error);
    return undefined;
  }

  if (pages.length === 0) {
    console.log('❌ No pages found to edit.');
    return undefined;
  }

  const pageToEdit = skipPrompts && optPageID ? optPageID : await select({
    message: 'Select a page to edit:',
    choices: pages.map((page) => ({
      name: `${page.pageName} (${page.pagePath})`,
      value: page.pageID,
    })),
  });

  const selectedPage = pages.find((p) => p.pageID === pageToEdit);
  if (!selectedPage) {
    console.error('❌ Selected page not found.');
    return undefined;
  }

  const originalPageName = selectedPage.pageName;
  const originalFolderName = toCamelCase(originalPageName);
  const originalRenderMethod = selectedPage.pageRenderMethod;

  let newPageName: string;
  let newPagePath: string;

  if (excludeFromRenaming.includes(selectedPage.pageName)) {
    console.log(`ℹ️ "${selectedPage.pageName}" is excluded from renaming.`);
    newPageName = selectedPage.pageName;
    newPagePath = selectedPage.pagePath.substring(1); 
  } else {
    newPageName = skipPrompts && optName ? optName : await input({
      message: 'Enter the page name:',
      default: selectedPage.pageName,
      validate: (input: string) => {
        if (!input) return 'Page name is required';
        if (!/^[A-Z]/.test(input)) return 'Page name must start with a capital letter';
        if (input !== selectedPage.pageName && pages.some((p) => p.pageName === input)) {
          return 'Page name already exists';
        }
        return true;
      },
    });

    newPagePath = skipPrompts && optPath ? optPath : await input({
      message: 'Enter the page path (without /, e.g., about):',
      default: selectedPage.pagePath.substring(1),
      validate: (input: string) => {
        if (!input) return 'Path is required';
        if (input.includes('/')) return 'Do not include "/" — it will be added automatically';
        if (input !== input.toLowerCase()) return 'Path must be all lowercase';
        const formatted = `/${input}`;
        if (formatted !== selectedPage.pagePath && pages.some((p) => p.pagePath === formatted)) {
          return 'Page path already exists';
        }
        return true;
      },
    });
  }

  const newPageRenderMethod = skipPrompts && optRender ? optRender : await select({
    message: 'Select render method:',
    choices: [
      { name: 'static', value: 'static' },
      { name: 'dynamic', value: 'dynamic' }
    ],
    default: selectedPage.pageRenderMethod,
  });

  const isConvertingToDynamic = originalRenderMethod === 'static' && newPageRenderMethod === 'dynamic';
  
  if (isConvertingToDynamic && !skipPrompts) {
    const confirmConversion = await confirm({
      message: '⚠️ Converting from static to dynamic will DELETE the existing static page component. Any custom changes made to the static page will be LOST. Continue?',
      default: false,
    });

    if (!confirmConversion) {
      console.log('❌ Page edit cancelled.');
      return undefined;
    }
  }

  let chosenTemplate: string | null = null;
  if (newPageRenderMethod === 'static' && !skipPrompts) {
    chosenTemplate = await select({
      message: 'Select a template:',
      choices: Object.keys(TEMPLATES).map((tpl) => ({ name: tpl, value: tpl })),
    });
  } else if (newPageRenderMethod === 'dynamic' && !skipPrompts) {
    chosenTemplate = await select({
      message: 'Select a template for dynamic rendering:',
      choices: Object.keys(TEMPLATES).map((tpl) => ({ name: tpl, value: tpl })),
    });
  } else if (skipPrompts && optTemplate) {
    chosenTemplate = optTemplate;
  }

  const newPageActive = skipPrompts && optActive !== undefined ? optActive : await confirm({
    message: 'Should this page be active by default?',
    default: selectedPage.pageActive,
  });

  let pageColor: TailwindColor | ThemeOptions;
  let pageIntensity: TailwindIntensity | false;

  if (!skipPrompts) {
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
  } else {
    pageColor = optColor!;
    pageIntensity = optIntensity!;
  }

  const newPageEntranceAnimation = skipPrompts && optEntrance ? optEntrance : await select({
    message: 'Select entrance animation:',
    choices: ENTRANCE_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
    default: selectedPage.pageEntranceAnimation,
  });

  const newPageExitAnimation = skipPrompts && optExit ? optExit : await select({
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
    pageEntranceAnimation: newPageEntranceAnimation as EntranceAnimation,
    pageExitAnimation: newPageExitAnimation as ExitAnimation,
  };

  if (newPageRenderMethod === 'dynamic' && chosenTemplate) {
    updatedPageData.pageContent = getJsonTemplate(chosenTemplate);
  } else if (newPageRenderMethod === 'static') {
    delete updatedPageData.pageContent;
  }

  const pageIndex = pages.findIndex((p) => p.pageID === pageToEdit);
  pages[pageIndex] = updatedPageData;

  try {
    const formattedPages = await prettier.format(JSON.stringify(pages), {
      parser: 'json',
    });
    await fs.writeFile(pagesJsonPath, formattedPages, 'utf-8');
    console.log(`✅ Page "${updatedPageData.pageName}" updated in pages.json`);
  } catch (error) {
    console.error('❌ Error writing to pages.json:', error);
    return undefined;
  }

  if (isConvertingToDynamic) {
    console.log('🔄 Converting static page to dynamic...');
    const oldFeaturesDir = path.resolve(process.cwd(), 'src/features', originalFolderName);
    
    try {
      await fs.access(oldFeaturesDir);
      await fs.rm(oldFeaturesDir, { recursive: true, force: true });
      console.log(`✅ Deleted static feature directory: ${originalFolderName}`);
    } catch {
      console.log(`ℹ️ Feature directory ${oldFeaturesDir} not found`);
    }

    const pageShellPath = path.resolve(process.cwd(), 'src/features/PageShell/PageShell.tsx');
    try {
      let pageShellContent = await fs.readFile(pageShellPath, 'utf-8');

      const importPattern = new RegExp(
        `import ${originalPageName} from '../${originalFolderName}/${originalPageName}';\\n?`,
        'g'
      );
      pageShellContent = pageShellContent.replace(importPattern, '');

      const renderPattern = new RegExp(
        `\\s*\\{activePage\\.activePageName === '${originalPageName}' && <${originalPageName} />\\}\\s*`,
        'g'
      );
      pageShellContent = pageShellContent.replace(renderPattern, '');

      await fs.writeFile(pageShellPath, pageShellContent, 'utf-8');
      console.log(`✅ Removed ${originalPageName} from PageShell`);
    } catch (error) {
      console.error('❌ Error updating PageShell:', error);
    } finally {
      formatFile(pageShellPath);
    }

    console.log(`✅ Successfully converted "${newPageName}" from static to dynamic`);
    return updatedPageData.pageID;
  }

  if (originalPageName !== newPageName && newPageRenderMethod === 'static') {
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

        const typeFileContent = `export interface ${newPageName}Props {}\n`;
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
    } catch (error) {
      console.error('❌ Error updating feature files:', error);
      return undefined;
    } finally {
      const pageShellPath = path.resolve(process.cwd(), 'src/features/PageShell/PageShell.tsx');
      formatFile(pageShellPath);
    }
  } else if (originalRenderMethod === 'dynamic' && newPageRenderMethod === 'static' && chosenTemplate) {
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

      const typeFileContent = `export interface ${newPageName}Props {}\n`;
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
      console.log(`✅ Template files generated for ${newPageName}`);
    } catch (error) {
      console.error('❌ Error generating template files:', error);
      return undefined;
    } finally {
      const pageShellPath = path.resolve(process.cwd(), 'src/features/PageShell/PageShell.tsx');
      formatFile(pageShellPath);
    }
  }

  return updatedPageData.pageID;
}