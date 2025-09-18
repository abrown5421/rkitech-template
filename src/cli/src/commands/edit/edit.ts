import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { COLORS, ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS, INTENSITIES } from "../../shared/constants/pageConstants.js";
import { PageData } from "../../shared/types/pageTypes.js";
import { blankTemplate } from "../../templates/blank.js";

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
    console.log("No pages found to edit.");
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
      message: "Select a page to edit:",
      choices: choices
    }
  ]);

  return answer.selectedPage;
}

async function promptPageEdits(currentPage: PageData): Promise<Partial<PageData>> {
  console.log(`\nEditing: ${currentPage.pageName}`);
  console.log("Press Enter to keep current values, or type new values to change them.\n");

  return inquirer.prompt([
    { 
      type: "input", 
      name: "pageName", 
      message: "Page Name:", 
      default: currentPage.pageName 
    },
    {
      type: "input",
      name: "pagePath",
      message: "Page Path (e.g. my-page):",
      default: currentPage.pagePath,
      filter: (input) => (input.startsWith("/") ? input : "/" + input),
    },
    {
      type: "list",
      name: "pageRenderMethod",
      message: "Page Render Method:",
      choices: ["static", "dynamic"],
      default: currentPage.pageRenderMethod,
    },
    {
      type: "confirm",
      name: "pageActive",
      message: "Set page as active?",
      default: currentPage.pageActive,
    },
    {
      type: "list",
      name: "pageColor",
      message: "Page Color:",
      choices: COLORS,
      default: currentPage.pageColor,
    },
    {
      type: "list",
      name: "pageIntensity",
      message: "Page Intensity:",
      choices: INTENSITIES.map((i) => i.toString()),
      default: currentPage.pageIntensity.toString(),
      filter: (input: string) => parseInt(input, 10),
    },
    {
      type: "list",
      name: "pageEntranceAnimation",
      message: "Entrance Animation:",
      choices: ENTRANCE_ANIMATIONS,
      default: currentPage.pageEntranceAnimation,
    },
    {
      type: "list",
      name: "pageExitAnimation",
      message: "Exit Animation:",
      choices: EXIT_ANIMATIONS,
      default: currentPage.pageExitAnimation,
    },
    {
      type: "input",
      name: "pageContent",
      message: "Page Content (optional):",
      default: currentPage.pageContent,
    },
  ]);
}

async function updatePageInJson(updatedPage: PageData): Promise<void> {
  try {
    const pagesJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/pages.json");
    const pages = await loadPagesFromJson();
    
    const updatedPages = pages.map(page => 
      page.pageID === updatedPage.pageID ? updatedPage : page
    );
    
    await fs.writeFile(pagesJsonPath, JSON.stringify(updatedPages, null, 2), "utf-8");
    
    console.log(`✅ Updated "${updatedPage.pageName}" in pages.json`);
  } catch (error) {
    console.error("❌ Error updating pages.json:", error);
    throw error;
  }
}

async function handleFeatureFolderChanges(
  oldPageName: string, 
  newPageName: string
): Promise<{ oldComponentName: string, newComponentName: string, oldFolderName: string, newFolderName: string }> {
  const oldFolderName = oldPageName.toLowerCase().replace(/\s+/g, '-');
  const oldComponentName = oldPageName.charAt(0).toUpperCase() + oldPageName.slice(1).replace(/\s+/g, '');
  
  const newFolderName = newPageName.toLowerCase().replace(/\s+/g, '-');
  const newComponentName = newPageName.charAt(0).toUpperCase() + newPageName.slice(1).replace(/\s+/g, '');

  try {
    const featuresPath = path.resolve(process.cwd(), "src/features");
    const oldFeatureFolderPath = path.join(featuresPath, oldFolderName);
    const newFeatureFolderPath = path.join(featuresPath, newFolderName);

    if (oldPageName !== newPageName) {
      try {
        await fs.access(oldFeatureFolderPath);
        
        await fs.mkdir(newFeatureFolderPath, { recursive: true });
        
        const newPageFileContent = blankTemplate(newComponentName, newFolderName);
        const newPageFilePath = path.join(newFeatureFolderPath, `${newComponentName}.tsx`);
        await fs.writeFile(newPageFilePath, newPageFileContent, "utf-8");
        
        const newTypesContent = `export interface ${newComponentName}Props {
  // Add props here as needed
}
`;
        const newTypesFilePath = path.join(newFeatureFolderPath, `${newFolderName}Types.ts`);
        await fs.writeFile(newTypesFilePath, newTypesContent, "utf-8");
        
        await fs.rm(oldFeatureFolderPath, { recursive: true, force: true });
        
        console.log(`✅ Renamed feature folder from "${oldFolderName}" to "${newFolderName}"`);
        console.log(`✅ Updated component from "${oldComponentName}" to "${newComponentName}"`);
        
      } catch (error) {
        console.warn(`⚠️  Original feature folder not found: ${oldFeatureFolderPath}`);
        
        await fs.mkdir(newFeatureFolderPath, { recursive: true });
        
        const newPageFileContent = blankTemplate(newComponentName, newFolderName);
        const newPageFilePath = path.join(newFeatureFolderPath, `${newComponentName}.tsx`);
        await fs.writeFile(newPageFilePath, newPageFileContent, "utf-8");
        
        const newTypesContent = `export interface ${newComponentName}Props {
  // Add props here as needed
}
`;
        const newTypesFilePath = path.join(newFeatureFolderPath, `${newFolderName}Types.ts`);
        await fs.writeFile(newTypesFilePath, newTypesContent, "utf-8");
        
        console.log(`✅ Created new feature folder: "${newFolderName}"`);
      }
    } else {
      console.log(`ℹ️  Page name unchanged, keeping existing feature folder`);
    }

    return { oldComponentName, newComponentName, oldFolderName, newFolderName };
    
  } catch (error) {
    console.error("❌ Error handling feature folder changes:", error);
    throw error;
  }
}

async function updatePageShell(
  oldPageName: string,
  newPageName: string,
  oldComponentName: string,
  newComponentName: string,
  oldFolderName: string,
  newFolderName: string
): Promise<void> {
  try {
    const pageShellPath = path.resolve(process.cwd(), "src/features/pageShell/PageShell.tsx");
    
    let currentContent = await fs.readFile(pageShellPath, "utf-8");
    
    if (oldPageName !== newPageName) {
      const oldImportPattern = new RegExp(`import ${oldComponentName} from '../${oldFolderName}/${oldComponentName}';\\n?`, 'g');
      currentContent = currentContent.replace(oldImportPattern, '');
      
      const newImportStatement = `import ${newComponentName} from '../${newFolderName}/${newComponentName}';`;
      const typeImportIndex = currentContent.indexOf("import type { PageData }");
      if (typeImportIndex !== -1) {
        const beforeTypeImport = currentContent.substring(0, typeImportIndex);
        const afterTypeImport = currentContent.substring(typeImportIndex);
        currentContent = beforeTypeImport + newImportStatement + '\n' + afterTypeImport;
      }
      
      const oldConditionalPatterns = [
        new RegExp(`{activePage\\.activePageName === '${oldPageName}' && <${oldComponentName} />}\\n?`, 'g'),
        new RegExp(`{activePage\\.activePageName === "${oldPageName}" && <${oldComponentName} />}\\n?`, 'g'),
      ];
      
      oldConditionalPatterns.forEach(pattern => {
        currentContent = currentContent.replace(pattern, '');
      });
      
      const newConditionalRender = `{activePage.activePageName === '${newPageName}' && <${newComponentName} />}`;
      const containerEndIndex = currentContent.lastIndexOf("</Container>");
      if (containerEndIndex !== -1) {
        currentContent = 
          currentContent.substring(0, containerEndIndex) + 
          newConditionalRender + '\n        ' +
          currentContent.substring(containerEndIndex);
      }
      
      currentContent = currentContent.replace(/\n\n\n+/g, '\n\n');
      
      console.log(`✅ Updated PageShell.tsx: "${oldPageName}" → "${newPageName}"`);
    } else {
      console.log(`ℹ️  Page name unchanged, PageShell.tsx remains the same`);
    }
    
    await fs.writeFile(pageShellPath, currentContent, "utf-8");
    
  } catch (error) {
    console.error("❌ Error updating PageShell.tsx:", error);
    throw error;
  }
}

export async function editCommand(): Promise<void> {
  try {
    console.log("✏️  Edit Page Command");
    console.log("Loading existing pages...\n");
    
    const pages = await loadPagesFromJson();
    
    const pageToEdit = await promptPageSelection(pages);
    
    if (!pageToEdit) {
      console.log("No page selected.");
      return;
    }
    
    const updatedData = await promptPageEdits(pageToEdit);
    
    const updatedPage: PageData = {
      ...pageToEdit,
      ...updatedData,
      pageID: pageToEdit.pageID
    };
    
    console.log(`\nUpdating page: ${pageToEdit.pageName}...\n`);
    
    const changes: string[] = [];
    Object.keys(updatedData).forEach(key => {
      const oldValue = (pageToEdit as any)[key];
      const newValue = (updatedData as any)[key];
      if (oldValue !== newValue) {
        changes.push(`${key}: "${oldValue}" → "${newValue}"`);
      }
    });
    
    if (changes.length > 0) {
      console.log("Changes to be made:");
      changes.forEach(change => console.log(`  • ${change}`));
      console.log();
    } else {
      console.log("No changes detected. Exiting...");
      return;
    }
    
    await updatePageInJson(updatedPage);
    
    const { oldComponentName, newComponentName, oldFolderName, newFolderName } = 
      await handleFeatureFolderChanges(pageToEdit.pageName, updatedPage.pageName);
    
    await updatePageShell(
      pageToEdit.pageName,
      updatedPage.pageName,
      oldComponentName,
      newComponentName,
      oldFolderName,
      newFolderName
    );
    
    console.log(`\n🎉 Successfully updated page: ${updatedPage.pageName}`);
    
  } catch (error) {
    console.error("❌ Error during edit operation:", error);
    process.exit(1);
  }
}