import { input, select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../types/pageTypes.js';
import { COLORS, INTENSITIES, THEME_COLORS } from '../../../shared/constants/tailwindConstants.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { createGUID } from '../../../shared/utils/createGUID.js';
import { TEMPLATES } from '../../../shared/constants/templateConstants.js';
import { formatFile } from '../../../shared/utils/formatFile.js';
import { TailwindColor, TailwindIntensity, ThemeOptions } from 'rkitech-components';

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function newPage() {
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

  const pageName = await input({
    message: 'Enter the page name:',
    validate: (input: string) => {
      if (!input) return 'Page name is required';
      if (pages.some((p) => p.pageName === input)) return 'Page name already exists';
      return true;
    },
  });

  const pagePath = await input({
    message: 'Enter the page path (without /, e.g., about):',
    validate: (input: string) => {
      if (!input) return 'Path is required';
      if (input.includes('/')) return 'Do not include "/" — it will be added automatically';
      const formatted = `/${input}`;
      if (pages.some((p) => p.pagePath === formatted)) return 'Page path already exists';
      return true;
    },
  });

  const pageRenderMethod = await select({
    message: 'Select render method:',
    choices: [
      { name: 'static', value: 'static' },
      { name: 'dynamic', value: 'dynamic' }
    ],
  });

  let chosenTemplate: string | null = null;
  if (pageRenderMethod === 'static') {
    chosenTemplate = await select({
      message: 'Select a template:',
      choices: Object.keys(TEMPLATES).map((tpl) => ({ name: tpl, value: tpl })),
    });
  }

  const pageActive = await confirm({
    message: 'Should this page be active by default?',
    default: true,
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

  const pageEntranceAnimation = await select({
    message: 'Select entrance animation:',
    choices: ENTRANCE_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
  });

  const pageExitAnimation = await select({
    message: 'Select exit animation:',
    choices: EXIT_ANIMATIONS.map((animation) => ({
      name: animation,
      value: animation,
    })),
  });

  const newPageData: PageData = {
    pageName,
    pagePath: `/${pagePath}`,
    pageRenderMethod: pageRenderMethod as 'static' | 'dynamic',
    pageActive,
    pageColor,
    pageIntensity,
    pageEntranceAnimation,
    pageExitAnimation,
    pageID: createGUID(),
  };

  pages.push(newPageData);

  try {
    const formattedPages = await prettier.format(JSON.stringify(pages), {
      parser: 'json',
    });
    await fs.writeFile(pagesJsonPath, formattedPages, 'utf-8');
    console.log(`✅ Page "${newPageData.pageName}" added to pages.json`);
  } catch (error) {
    console.error('❌ Error writing to pages.json:', error);
  }

  if (pageRenderMethod === 'static' && chosenTemplate) {
    const folderName = toCamelCase(pageName);
    const featuresDir = path.resolve(
      process.cwd(),
      'src/features',
      folderName
    );

    const pageShellPath = path.resolve(
      process.cwd(),
      'src/features/PageShell/PageShell.tsx'
    );

    try {
      await fs.mkdir(featuresDir, { recursive: true });

      const templateFn = TEMPLATES[chosenTemplate];
      const componentCode = templateFn(pageName, folderName);
      const formattedCode = await prettier.format(componentCode, {
        parser: 'typescript',
      });

      await fs.writeFile(
        path.join(featuresDir, `${pageName}.tsx`),
        formattedCode,
        'utf-8'
      );

      const typeFileContent = `export interface ${pageName}Props {
    
      }
      `
      await fs.writeFile(
        path.join(featuresDir, `${folderName}Types.ts`),
        typeFileContent,
        'utf-8'
      );

      let pageShellContent = await fs.readFile(pageShellPath, 'utf-8');

      const importStatement = `import ${pageName} from '../${folderName}/${pageName}';`;
      if (!pageShellContent.includes(importStatement)) {
        pageShellContent = pageShellContent.replace(
          /(import React.*;)/,
          `$1\n${importStatement}`
        );
      }

      const renderSnippet = `      {activePage.activePageName === '${pageName}' && <${pageName} />}\n`;

      pageShellContent = pageShellContent.replace(
        /(\{\s*'\s*'\s*\})/,
        `${renderSnippet}$1`
      );

      await fs.writeFile(pageShellPath, pageShellContent, 'utf-8');

    } catch (error) {
      console.error('❌ Error generating template files:', error);
    } finally {
      formatFile(pageShellPath)
    }
  }
}
