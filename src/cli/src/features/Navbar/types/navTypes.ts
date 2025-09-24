import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components"
import { NavItem } from "../../../shared/types/navItemTypes.js"

export interface Navbar {
    navbarTitle: string,
    navbarBgColor: TailwindColor | ThemeOptions,
    navbarBgIntensity: TailwindIntensity | false,
    navbarSticky: boolean;
    navbarLeftSectionAnimations: {
        entranceAnimation: EntranceAnimation | 'none',
        exitAnimation: ExitAnimation | 'none'
    },
    navbarMenuItems: NavItem[]
}