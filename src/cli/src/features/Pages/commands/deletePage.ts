import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { PageData } from '../types/pageTypes.js';
import { formatFile } from '../../../shared/utils/formatFile.js';
import { Footer } from '../../Footer/types/footerTypes.js';
import { Navbar } from '../../Navbar/types/navTypes.js';

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function deletePage() {
  const pagesJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Pages/json/pages.json'
  );

  const footerJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Footer/json/footer.json'
  );

  const navbarJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Navbar/json/navbar.json'
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

  try {
    let footer: Footer;
    let navbar: Navbar;

    try {
      const footerRaw = await fs.readFile(footerJsonPath, 'utf-8');
      footer = JSON.parse(footerRaw);
      const beforeCount =
        footer.footerPrimaryMenuItems.length + footer.footerAuxilaryMenuItems.length;
      footer.footerPrimaryMenuItems = footer.footerPrimaryMenuItems.filter(
        (item) => item.itemID !== pageToDelete
      );
      footer.footerAuxilaryMenuItems = footer.footerAuxilaryMenuItems.filter(
        (item) => item.itemID !== pageToDelete
      );
      const afterCount =
        footer.footerPrimaryMenuItems.length + footer.footerAuxilaryMenuItems.length;

      if (beforeCount !== afterCount) {
        const formattedFooter = await prettier.format(JSON.stringify(footer), {
          parser: 'json',
        });
        await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
        console.log(`🧹 Removed page references from footer.json`);
      }
    } catch {
      console.warn('⚠️ Footer.json not found, skipping footer cleanup.');
    }

    // Navbar
    try {
      const navbarRaw = await fs.readFile(navbarJsonPath, 'utf-8');
      navbar = JSON.parse(navbarRaw);
      const beforeCount = navbar.navbarMenuItems.length;
      navbar.navbarMenuItems = navbar.navbarMenuItems.filter(
        (item) => item.itemID !== pageToDelete
      );
      if (beforeCount !== navbar.navbarMenuItems.length) {
        const formattedNavbar = await prettier.format(JSON.stringify(navbar), {
          parser: 'json',
        });
        await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
        console.log(`🧹 Removed page references from navbar.json`);
      }
    } catch {
      console.warn('⚠️ Navbar.json not found, skipping navbar cleanup.');
    }
  } catch (error) {
    console.error('❌ Error cleaning up nav/footer references:', error);
  }

  if (selectedPage.pageRenderMethod === 'static') {
    const featuresDir = path.resolve(process.cwd(), 'src/features', folderName);

    try {
      await fs.access(featuresDir);
      await fs.rm(featuresDir, { recursive: true, force: true });
    } catch {
      console.log(`ℹ️ Feature directory ${featuresDir} not found (normal for dynamic pages)`);
    }

    const pageShellPath = path.resolve(
      process.cwd(),
      'src/features/PageShell/PageShell.tsx'
    );

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

  console.log(`✅ Successfully deleted page "${pageName}" and cleaned up references.`);
}
