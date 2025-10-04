import { input } from '@inquirer/prompts';

export async function openFileExplorer(): Promise<string | null> {
  console.log('\n📂 Opening file explorer...');

  const selectorModule = await import('inquirer-file-selector');
  const filePrompt = selectorModule.default?.file || selectorModule.file;

  if (!filePrompt) {
    console.error('❌ Could not load file selector');
    return null;
  }

  const filePath = await filePrompt({
    message: 'Select a file:',
    root: process.cwd(),
    onlyShowDir: false,
    default: process.cwd(),
  });

  if (!filePath) {
    console.warn('⚠️ No file selected');
    return null;
  }

  console.log(`✅ Selected file: ${filePath}`);
  return filePath;
}
