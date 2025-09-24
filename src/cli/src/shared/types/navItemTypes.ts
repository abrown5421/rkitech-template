import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components";

export interface NavItem {
    itemName: string;
    itemType: 'page' | 'link',
    itemLink?: string;
    itemID: string,
    itemColor: TailwindColor | ThemeOptions,
    itemIntensity: TailwindIntensity | false,
    itemHoverColor: TailwindColor | ThemeOptions,
    itemHoverIntensity: TailwindIntensity | false,
    itemActiveColor: TailwindColor | ThemeOptions,
    itemActiveIntensity: TailwindIntensity | false,
    itemEntranceAnimation: EntranceAnimation,
    itemExitAnimation: ExitAnimation
}