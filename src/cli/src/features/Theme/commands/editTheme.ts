import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import { COLORS, THEME_COLORS, INTENSITIES } from '../../../shared/constants/tailwindConstants.js';
import { EditThemeOptions, Theme } from '../types/themeTypes.js';
import { TailwindColor, TailwindIntensity, ThemeOptions } from 'rkitech-components';

const themeJsonPath = path.resolve(
  process.cwd(),
  'src/cli/src/features/Theme/json/theme.json'
);

async function loadTheme(): Promise<Theme> {
  const themeData = await readFile(themeJsonPath, 'utf-8');
  return JSON.parse(themeData) as Theme;
}

async function saveTheme(theme: Theme): Promise<void> {
  const themeData = JSON.stringify(theme, null, 4);
  await writeFile(themeJsonPath, themeData, 'utf-8');
  console.log('✅ Theme saved successfully!');
}

export async function editTheme(options?: EditThemeOptions): Promise<void> {
  const { themeOption: optThemeOption, color: optColor, intensity: optIntensity, skipPrompts } = options || {};

  try {
    const theme = await loadTheme();

    let themeOption: ThemeOptions;
    let selectedColor: TailwindColor;
    let selectedIntensity: TailwindIntensity;

    if (skipPrompts && optThemeOption && optColor && optIntensity) {
      themeOption = optThemeOption;
      selectedColor = optColor;
      selectedIntensity = optIntensity;
    } else {
      console.log('Theme Menu - choose a property to edit (Use arrow keys)');

      const { themeOption: chosenOption } = await inquirer.prompt<{ themeOption: ThemeOptions }>([
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

      themeOption = chosenOption;

      console.log(`\nEditing: ${themeOption}`);
      console.log(`Current value: ${theme[themeOption].color}-${theme[themeOption].intensity}`);

      const { selectedColor: cliColor } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedColor',
          message: 'Select a base color:',
          choices: COLORS,
          pageSize: 15
        }
      ]);

      const { selectedIntensity: cliIntensity } = await inquirer.prompt([
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

      selectedColor = cliColor;
      selectedIntensity = cliIntensity;
    }

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
