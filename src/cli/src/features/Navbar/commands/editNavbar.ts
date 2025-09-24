import { confirm, input, select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { COLORS, INTENSITIES } from '../../../shared/constants/tailwindConstants.js';
import { ENTRANCE_ANIMATIONS, EXIT_ANIMATIONS } from '../../../shared/constants/animationConstants.js';
import { Navbar } from '../types/navTypes.js';
import { EntranceAnimation, ExitAnimation } from 'rkitech-components';

export async function editNavbar() {
  const navbarJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Navbar/json/navbar.json'
  );

  try {
    await fs.access(navbarJsonPath);
  } catch (error) {
    console.error(`❌ Could not find navbar.json at: ${navbarJsonPath}`);
    console.log('Please ensure the navbar.json file exists in the correct location.');
    return;
  }

  let navbar: Navbar;
  try {
    const navbarRaw = await fs.readFile(navbarJsonPath, 'utf-8');
    navbar = JSON.parse(navbarRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing navbar.json:', error);
    return;
  }

  const navbarSticky = await confirm({
    message: 'Make the navbar sticky?',
    default: navbar.navbarSticky,
  });

  const newNavbarTitle = await input({
    message: 'Enter the navbar title:',
    default: navbar.navbarTitle,
    validate: (input: string) => {
      if (!input) return 'Navbar title is required';
      return true;
    },
  });

  const newNavbarBgColor = await select({
    message: 'Select navbar background color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
    default: navbar.navbarBgColor,
  });

  const newNavbarBgIntensity = await select({
    message: 'Select navbar background intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
    default: navbar.navbarBgIntensity,
  });

  const newLeftEntranceAnimation = await select({
    message: 'Select left section entrance animation:',
    choices: [
      { name: 'none', value: 'none' },
      ...ENTRANCE_ANIMATIONS.map((animation) => ({
        name: animation,
        value: animation,
      })),
    ],
    default: navbar.navbarLeftSectionAnimations.entranceAnimation,
  });

  const newLeftExitAnimation = await select({
    message: 'Select left section exit animation:',
    choices: [
      { name: 'none', value: 'none' },
      ...EXIT_ANIMATIONS.map((animation) => ({
        name: animation,
        value: animation,
      })),
    ],
    default: navbar.navbarLeftSectionAnimations.exitAnimation,
  });

  const updatedNavbar: Navbar = {
    ...navbar,
    navbarSticky: navbarSticky,
    navbarTitle: newNavbarTitle,
    navbarBgColor: newNavbarBgColor,
    navbarBgIntensity: newNavbarBgIntensity,
    navbarLeftSectionAnimations: {
      entranceAnimation: newLeftEntranceAnimation as EntranceAnimation,
      exitAnimation: newLeftExitAnimation as ExitAnimation,
    },
  };

  try {
    const formattedNavbar = await prettier.format(JSON.stringify(updatedNavbar), {
      parser: 'json',
    });
    await fs.writeFile(navbarJsonPath, formattedNavbar, 'utf-8');
    console.log('✅ Navbar settings updated successfully');
  } catch (error) {
    console.error('❌ Error writing to navbar.json:', error);
  }
}