import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { PageData } from "../../shared/types/pageTypes.js";
import { formatFile } from "../../shared/utils/formatFile.js";

async function loadPagesFromJson(): Promise<PageData[]> {
  try {
    const pagesJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/pages.json");
    const fileContent = await fs.readFile(pagesJsonPath, "utf-8");
    const pagesArray = JSON.parse(fileContent);
    
    if (!Array.isArray(pagesArray)) {
      console.warn("pages.json does not contain an array");
      return [];
    }
    
    return pagesArray;
  } catch (error) {
    console.error("❌ Error reading pages.json:", error);
    return [];
  }
}

async function promptPageSelection(pages: PageData[]): Promise<PageData | null> {
  if (pages.length === 0) {
    console.log("No pages found to delete.");
    return null;
  }

  const choices = pages.map(page => ({
    name: `${page.pageName} (${page.pagePath}) - ${page.pageColor}-${page.pageIntensity}`,
    value: page
  }));

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedPage",
      message: "Select a page to delete:",
      choices: choices
    }
  ]);

  const confirmAnswer = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmDelete",
      message: `Are you sure you want to delete "${answer.selectedPage.pageName}"? This action cannot be undone.`,
      default: false
    }
  ]);

  return confirmAnswer.confirmDelete ? answer.selectedPage : null;
}

async function removePageFromJson(pageToDelete: PageData): Promise<void> {
  try {
    const pagesJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/pages.json");
    const pages = await loadPagesFromJson();
    
    const updatedPages = pages.filter(page => page.pageID !== pageToDelete.pageID);
    
    await fs.writeFile(pagesJsonPath, JSON.stringify(updatedPages, null, 2), "utf-8");
    console.log(`✅ Removed "${pageToDelete.pageName}" from pages.json`);
  } catch (error) {
    console.error("❌ Error updating pages.json:", error);
    throw error;
  }
}

async function removeFeatureFolder(pageName: string): Promise<{ componentName: string, folderName: string }> {
  try {
    const folderName = pageName.toLowerCase().replace(/\s+/g, '-');
    const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/\s+/g, '');
    
    const featureFolderPath = path.resolve(process.cwd(), "src/features", folderName);
    
    try {
      await fs.access(featureFolderPath);
      await fs.rm(featureFolderPath, { recursive: true, force: true });
      console.log(`✅ Deleted feature folder: ${featureFolderPath}`);
    } catch (error) {
      console.warn(`⚠️  Feature folder not found: ${featureFolderPath}`);
    }
    
    return { componentName, folderName };
  } catch (error) {
    console.error("❌ Error removing feature folder:", error);
    throw error;
  }
}

async function removeFromPageShell(pageName: string, componentName: string, folderName: string): Promise<void> {
  try {
    const pageShellPath = path.resolve(process.cwd(), "src/features/pageShell/PageShell.tsx");
    let currentContent = await fs.readFile(pageShellPath, "utf-8");
    
    const importPattern = new RegExp(`import ${componentName} from '../${folderName}/${componentName}';\\n?`, 'g');
    currentContent = currentContent.replace(importPattern, '');
    
    const lines = currentContent.split('\n');
    const cliCommentIndex = lines.findIndex(line => 
      line.includes('cli pages should appear here')
    );
    
    if (cliCommentIndex !== -1) {
      const conditionalPattern = new RegExp(`\\s*{activePage\\.activePageName === ['"]${pageName}['"] && <${componentName} />}\\s*`);
      
      for (let i = cliCommentIndex + 1; i < lines.length; i++) {
        if (conditionalPattern.test(lines[i])) {
          lines.splice(i, 1);
          break;
        }
      }
      
      currentContent = lines.join('\n');
    } else {
      const conditionalPatterns = [
        new RegExp(`\\s*{activePage\\.activePageName === '${pageName}' && <${componentName} />}\\n?`, 'g'),
        new RegExp(`\\s*{activePage\\.activePageName === "${pageName}" && <${componentName} />}\\n?`, 'g'),
      ];
      
      conditionalPatterns.forEach(pattern => {
        currentContent = currentContent.replace(pattern, '');
      });
    }
    
    currentContent = currentContent.replace(/\n\n\n+/g, '\n\n');
    
    await fs.writeFile(pageShellPath, currentContent, "utf-8");
    console.log(`✅ Removed import and conditional render for ${componentName} from PageShell.tsx`);
  } catch (error) {
    console.error("❌ Error updating PageShell.tsx:", error);
    throw error;
  }
}

export async function deleteCommand(): Promise<void> {
  try {
    console.log("🗑️  Delete Page Command");
    console.log("Loading existing pages...\n");
    
    const pages = await loadPagesFromJson();
    const pageToDelete = await promptPageSelection(pages);
    
    if (!pageToDelete) {
      console.log("Delete operation cancelled.");
      return;
    }
    
    console.log(`\nDeleting page: ${pageToDelete.pageName}...`);
    
    await removePageFromJson(pageToDelete);
    const { componentName, folderName } = await removeFeatureFolder(pageToDelete.pageName);
    await removeFromPageShell(pageToDelete.pageName, componentName, folderName);
    
    console.log(`\n🎉 Successfully deleted page: ${pageToDelete.pageName}`);
    console.log(`📊 Pages remaining: ${pages.length - 1}`);
    
  } catch (error) {
    console.error("❌ Error during delete operation:", error);
    process.exit(1);
  } finally {
    const pageShellPath = path.resolve(process.cwd(), "src/features/pageShell/PageShell.tsx");
    await formatFile(pageShellPath);
  }
}