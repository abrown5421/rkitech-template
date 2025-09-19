import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { COLORS, ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS, INTENSITIES } from "../../shared/constants/pageConstants.js";
import { createGUID } from "../../shared/utils/createGUID.js";
import { PageData } from "../../shared/types/pageTypes.js";
import { blankTemplate } from "../../templates/blank.js";
import { formatFile } from "../../shared/utils/formatFile.js";
import { TEMPLATES } from "../../shared/constants/templateConstants.js";

async function loadExistingPages(): Promise<PageData[]> {
  try {
    const pagesJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/pages.json");
    const fileContent = await fs.readFile(pagesJsonPath, "utf-8");
    const pagesArray = JSON.parse(fileContent);
    
    if (!Array.isArray(pagesArray)) {
      return [];
    }
    
    return pagesArray;
  } catch (error) {
    return [];
  }
}

async function promptPageInfo() {
  const existingPages = await loadExistingPages();
  const existingNames = existingPages.map(page => page.pageName.toLowerCase());
  const existingPaths = existingPages.map(page => page.pagePath.toLowerCase());
  let templateAnswer = "Blank";
  const pageInfoAnswers = await inquirer.prompt([
    { 
      type: "input", 
      name: "pageName", 
      message: "Page Name:",
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return "Page name is required. Please enter a valid page name.";
        }
        if (existingNames.includes(input.toLowerCase())) {
          return `Page name "${input}" already exists. Please choose a different name.`;
        }
        return true;
      }
    },
    {
      type: "input",
      name: "pagePath",
      message: "Page Path (e.g. my-page):",
      filter: (input) => (input.startsWith("/") ? input : "/" + input),
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return "Page path is required. Please enter a valid path.";
        }
        const processedPath = (input.startsWith("/") ? input : "/" + input).toLowerCase();
        if (existingPaths.includes(processedPath)) {
          return `Page path "${processedPath}" already exists. Please choose a different path.`;
        }
        return true;
      }
    },
    {
      type: "list",
      name: "pageRenderMethod",
      message: "Page Render Method:",
      choices: ["static", "dynamic"],
    },
    {
      type: "confirm",
      name: "pageActive",
      message: "Set page as active?",
      default: false,
    },
    {
      type: "list",
      name: "pageColor",
      message: "Page Color:",
      choices: COLORS,
    },
    {
      type: "list",
      name: "pageIntensity",
      message: "Page Intensity:",
      choices: INTENSITIES.map((i) => i.toString()),
      filter: (input: string) => parseInt(input, 10),
    },
    {
      type: "list",
      name: "pageEntranceAnimation",
      message: "Entrance Animation:",
      choices: ENTRANCE_ANIMATIONS,
    },
    {
      type: "list",
      name: "pageExitAnimation",
      message: "Exit Animation:",
      choices: EXIT_ANIMATIONS,
    },
    {
      type: "input",
      name: "pageContent",
      message: "Page Content (optional):",
      default: "",
    },
  ]);
  if (pageInfoAnswers.pageRenderMethod === "static") {
    const templateChoice = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "Select a template for this page:",
        choices: Object.keys(TEMPLATES),
        default: "Blank",
      }
    ]);

    templateAnswer = templateChoice.template;
  }

  return { pageData: pageInfoAnswers, template: templateAnswer };
}


async function createFeatureFolder(pageName: string, templateFunc: (componentName: string, folderName: string) => string) {
  try {
    const folderName = pageName.toLowerCase().replace(/\s+/g, '-');
    const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/\s+/g, '');
    
    const featuresPath = path.resolve(process.cwd(), "src/features");
    const featureFolderPath = path.join(featuresPath, folderName);
    
    await fs.mkdir(featuresPath, { recursive: true });
    await fs.mkdir(featureFolderPath, { recursive: true });
    
    const pageFileContent = templateFunc(componentName, folderName);
    const pageFilePath = path.join(featureFolderPath, `${componentName}.tsx`);
    await fs.writeFile(pageFilePath, pageFileContent, "utf-8");
    
    const typesContent = `export interface ${componentName}Props {
  // Add props here as needed
}
`;
    const typesFilePath = path.join(featureFolderPath, `${folderName}Types.ts`);
    await fs.writeFile(typesFilePath, typesContent, "utf-8");
    
    console.log(`✅ Created feature folder: ${featureFolderPath}`);
    console.log(`✅ Created page file: ${componentName}.tsx`);
    console.log(`✅ Created types file: ${folderName}Types.ts`);
    
    return { componentName, folderName };
    
  } catch (error) {
    console.error("❌ Error creating feature folder:", error);
    throw error;
  }
}

async function updatePageShell(pageName: string, componentName: string, folderName: string) {
  try {
    const pageShellPath = path.resolve(process.cwd(), "src/features/pageShell/PageShell.tsx");
    const currentContent = await fs.readFile(pageShellPath, "utf-8");
    
    const importStatement = `import ${componentName} from '../${folderName}/${componentName}';`;
    const pageShellComponentIndex = currentContent.indexOf("const PageShell:");
    
    let updatedContent = currentContent;
    
    const beforeComponent = currentContent.substring(0, pageShellComponentIndex);
    const lastImportIndex = beforeComponent.lastIndexOf("import ");
    const endOfLastImport = beforeComponent.indexOf(";", lastImportIndex) + 1;
    
    updatedContent = 
      currentContent.substring(0, endOfLastImport) + 
      '\n' + importStatement + 
      currentContent.substring(endOfLastImport);
    
    const conditionalRender = `            {activePage.activePageName === '${pageName}' && <${componentName} />}`;
    const cliCommentPattern = /{\s*\/\*\s*cli pages should appear here\s*\*\/\s*}/;
    const cliCommentMatch = updatedContent.match(cliCommentPattern);
    
    if (cliCommentMatch) {
      const cliCommentIndex = updatedContent.indexOf(cliCommentMatch[0]);
      const afterComment = cliCommentIndex + cliCommentMatch[0].length;
      
      updatedContent = 
        updatedContent.substring(0, afterComment) + 
        '\n' + conditionalRender +
        updatedContent.substring(afterComment);
    } else {
      console.warn("⚠️  CLI comment not found, adding at end of Container");
      const containerEndIndex = updatedContent.lastIndexOf("</Container>");
      if (containerEndIndex !== -1) {
        updatedContent = 
          updatedContent.substring(0, containerEndIndex) + 
          conditionalRender + '\n            ' +
          updatedContent.substring(containerEndIndex);
      }
    }
    
    await fs.writeFile(pageShellPath, updatedContent, "utf-8");
    console.log(`✅ Updated PageShell.tsx with import and conditional render for ${componentName}`);
    
  } catch (error) {
    console.error("❌ Error updating PageShell.tsx:", error);
    throw error;
  }
}

async function addPageToJson(pageData: PageData) {
  try {
    const pagesJsonPath = path.resolve(process.cwd(), "src/cli/src/shared/json/pages.json");
    
    let pagesArray: PageData[] = [];
    
    try {
      const fileContent = await fs.readFile(pagesJsonPath, "utf-8");
      pagesArray = JSON.parse(fileContent);
      
      if (!Array.isArray(pagesArray)) {
        console.warn("pages.json does not contain an array, initializing as empty array");
        pagesArray = [];
      }
    } catch (error) {
      console.log("pages.json not found or invalid, creating new file with empty array");
      pagesArray = [];
    }
    
    pagesArray.push(pageData);
    
    await fs.writeFile(pagesJsonPath, JSON.stringify(pagesArray, null, 2), "utf-8");
    console.log(`✅ Successfully added page "${pageData.pageName}" to pages.json`);
    
  } catch (error) {
    console.error("❌ Error updating pages.json:", error);
    throw error;
  }
}

export async function newCommand() {
  try {
    const { pageData, template } = await promptPageInfo();
    const pageID = createGUID();
    const fullPageData: PageData = { ...pageData, pageID };
    
    await addPageToJson(fullPageData);
    
    const templateFunc = TEMPLATES[template] || blankTemplate;
    const { componentName, folderName } = await createFeatureFolder(fullPageData.pageName, templateFunc);
    await updatePageShell(fullPageData.pageName, componentName, folderName);
    
    console.log(`🎉 Successfully created new page: ${fullPageData.pageName}`);
    
  } catch (error) {
    console.error("❌ Error creating new page:", error);
    process.exit(1);
  } finally {
    const pageShellPath = path.resolve(process.cwd(), "src/features/pageShell/PageShell.tsx");
    await formatFile(pageShellPath);
  }
}