
import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components";

export interface NavItem {
    itemName: string;
    itemType: 'page' | 'link',
    itemStyle: 'string' | 'button',
    itemLink?: string;
    itemID: string,
    itemOrder: number,
    itemColor: TailwindColor | ThemeOptions,
    itemIntensity: TailwindIntensity | false,
    itemHoverColor: TailwindColor | ThemeOptions,
    itemHoverIntensity: TailwindIntensity | false,
    itemBackgroundColor?: TailwindColor | ThemeOptions,
    itemBackgroundIntensity?: TailwindIntensity | false,
    itemBackgroundHoverColor?: TailwindColor | ThemeOptions,
    itemBackgroundHoverIntensity?: TailwindIntensity | false,
    itemBorderColor?: TailwindColor | ThemeOptions,
    itemBorderIntensity?: TailwindIntensity | false,
    itemBorderHoverColor?: TailwindColor | ThemeOptions,
    itemBorderHoverIntensity?: TailwindIntensity | false,
    itemActiveColor: TailwindColor | ThemeOptions,
    itemActiveIntensity: TailwindIntensity | false,
    itemEntranceAnimation: EntranceAnimation,
    itemExitAnimation: ExitAnimation
}