import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components"
import { NavItem } from "../../../shared/types/navItemTypes.js"

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