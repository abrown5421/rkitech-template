import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import { COLORS, THEME_COLORS, INTENSITIES } from '../../../shared/constants/tailwindConstants.js';
import { Theme } from '../types/themeTypes.js';
import { ThemeOptions } from 'rkitech-components';

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

async function saveTheme(theme: Theme): Promise<void> {
  try {
    const themeData = JSON.stringify(theme, null, 4);
    await writeFile(themeJsonPath, themeData, 'utf-8');
    console.log('✅ Theme saved successfully!');
  } catch (error) {
    console.error('Error saving theme:', error);
    throw error;
  }
}


export async function editTheme(): Promise<void> {
  try {
    console.log('Theme Menu - choose a property to edit (Use arrow keys)');

    const theme = await loadTheme();

    const { themeOption } = await inquirer.prompt<{ themeOption: ThemeOptions }>([
      {
        type: 'list',
        name: 'themeOption',
        message: 'Select a theme property to edit:',
        choices: THEME_COLORS.map(option => ({
          name: `${option} (current: ${theme[option as ThemeOptions].color}-${theme[option as ThemeOptions].intensity})`,
          value: option
        }))
      }
    ]);

    console.log(`\nEditing: ${themeOption}`);
    console.log(`Current value: ${theme[themeOption].color}-${theme[themeOption].intensity}`);

    const { selectedColor } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedColor',
        message: 'Select a base color:',
        choices: COLORS,
        pageSize: 15
      }
    ]);

    const { selectedIntensity } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedIntensity',
        message: 'Select color intensity:',
        choices: INTENSITIES.map(intensity => ({
          name: intensity.toString(),
          value: intensity
        }))
      }
    ]);

    theme[themeOption] = {
      color: selectedColor,
      intensity: selectedIntensity
    };

    await saveTheme(theme);

    console.log('Returning to main menu...');
  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
}
