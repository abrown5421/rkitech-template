import type { Theme } from "../cli/src/features/Theme/types/themeTypes";

export type ThemeColorKey = keyof Theme;

export function getThemeColorKey(color: string): color is ThemeColorKey {
    return ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'black', 'white'].includes(color);
}