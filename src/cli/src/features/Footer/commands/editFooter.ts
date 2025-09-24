import { confirm, input, select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { COLORS, INTENSITIES } from '../../../shared/constants/tailwindConstants.js';
import type { Footer } from '../types/footerTypes.js';

export async function editFooter() {
  const footerJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Footer/json/footer.json'
  );

  try {
    await fs.access(footerJsonPath);
  } catch (error) {
    console.error(`❌ Could not find footer.json at: ${footerJsonPath}`);
    console.log('Please ensure the footer.json file exists in the correct location.');
    return;
  }

  let footer: Footer;
  try {
    const footerRaw = await fs.readFile(footerJsonPath, 'utf-8');
    footer = JSON.parse(footerRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing footer.json:', error);
    return;
  }

  const newFooterBgColor = await select({
    message: 'Select footer background color:',
    choices: COLORS.map((color) => ({ name: color, value: color })),
    default: footer.footerBgColor,
  });

  const newFooterBgIntensity = await select({
    message: 'Select footer background intensity:',
    choices: INTENSITIES.map((intensity) => ({
      name: intensity.toString(),
      value: intensity,
    })),
    default: footer.footerBgIntensity,
  });

  const showCopyright = await confirm({
    message: 'Show copyright text?',
    default: footer.footerCopyright.show,
  });

  let newCopyrightText = footer.footerCopyright.text;
  if (showCopyright) {
    newCopyrightText = await input({
      message: 'Enter copyright text:',
      default: footer.footerCopyright.text,
      validate: (input: string) => {
        if (!input) return 'Copyright text is required';
        return true;
      },
    });
  }

  const updatedFooter: Footer = {
    ...footer,
    footerBgColor: newFooterBgColor,
    footerBgIntensity: newFooterBgIntensity,
    footerCopyright: {
      show: showCopyright,
      text: showCopyright ? newCopyrightText : '',
    },
    footerPrimaryMenuItems: footer.footerPrimaryMenuItems,
    footerAuxilaryMenuItems: footer.footerAuxilaryMenuItems,
  };

  try {
    const formattedFooter = await prettier.format(JSON.stringify(updatedFooter), {
      parser: 'json',
    });
    await fs.writeFile(footerJsonPath, formattedFooter, 'utf-8');
    console.log('✅ Footer settings updated successfully');
  } catch (error) {
    console.error('❌ Error writing to footer.json:', error);
  }
}
