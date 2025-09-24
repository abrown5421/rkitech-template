import { select } from '@inquirer/prompts';
import { COLORS, INTENSITIES, THEME_COLORS } from '../constants/tailwindConstants.js';
import { TailwindColor, TailwindIntensity, ThemeOptions } from 'rkitech-components';

interface ColorSelection {
  color: TailwindColor | ThemeOptions;
  intensity: TailwindIntensity | false;
}

export async function selectColorAndIntensity(
  colorLabel: string,
  defaultColor?: TailwindColor | ThemeOptions,
  defaultIntensity?: TailwindIntensity | false
): Promise<ColorSelection> {
  const colorType = await select({
    message: 'Select color type:',
    choices: [
      { name: 'Tailwind Color', value: 'tailwind' },
      { name: 'Theme Color', value: 'theme' }
    ],
  });

  if (colorType === 'tailwind') {
    const color = await select({
      message: `Select ${colorLabel} color:`,
      choices: COLORS.map((color) => ({ name: color, value: color })),
      ...(defaultColor && typeof defaultColor === 'string' && COLORS.includes(defaultColor as any) && { default: defaultColor }),
    });

    const intensity = await select({
      message: `Select ${colorLabel} intensity:`,
      choices: INTENSITIES.map((intensity) => ({
        name: intensity.toString(),
        value: intensity,
      })),
      ...(defaultIntensity && { default: defaultIntensity }),
    });

    return { color, intensity };
  } else {
    const color = await select({
      message: `Select ${colorLabel} theme color:`,
      choices: THEME_COLORS.map((color) => ({ name: color, value: color })),
      ...(defaultColor && typeof defaultColor === 'string' && THEME_COLORS.includes(defaultColor as any) && { default: defaultColor }),
    });

    return { color, intensity: false };
  }
}