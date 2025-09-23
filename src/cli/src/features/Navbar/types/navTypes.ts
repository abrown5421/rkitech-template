import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components"

export interface NavItem {
    itemName: string;
    itemType: 'page' | 'link',
    itemLink?: string;
    itemID: string,
    itemColor: TailwindColor,
    itemIntensity: TailwindIntensity,
    itemHoverColor: TailwindColor,
    itemHoverIntensity: TailwindIntensity,
    itemActiveColor: TailwindColor,
    itemActiveIntensity: TailwindIntensity,
    itemEntranceAnimation: EntranceAnimation,
    itemExitAnimation: ExitAnimation
}

export interface Navbar {
    navbarTitle: string,
    navbarBgColor: TailwindColor,
    navbarBgIntensity: TailwindIntensity,
    navbarSticky: boolean;
    navbarLeftSectionAnimations: {
        entranceAnimation: EntranceAnimation | 'none',
        exitAnimation: ExitAnimation | 'none'
    },
    navbarMenuItems: NavItem[]
}