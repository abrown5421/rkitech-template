import { TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components";

export const COLORS: readonly TailwindColor[] = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone'
] as const;

export const THEME_COLORS: readonly ThemeOptions[] = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
  'quinary',
  'black',
  'white',
] as const;

export const INTENSITIES: readonly TailwindIntensity[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
] as const;