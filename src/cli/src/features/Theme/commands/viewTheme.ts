import { readFile } from 'fs/promises';
import path from 'path';
import { Theme } from '../types/themeTypes.js';

const themeJsonPath = path.resolve(
      process.cwd(),
      'src/cli/src/features/Theme/json/theme.json'
  );

async function loadTheme(): Promise<Theme> {
  try {
    const themeData = await readFile(themeJsonPath, 'utf-8');
    return JSON.parse(themeData) as Theme;
  } catch (error) {
    console.error('Error loading theme:', error);
    throw error;
  }
}

export async function viewTheme() {
    const theme = await loadTheme();
    console.log(theme)
    return theme;
}