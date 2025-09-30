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

export interface NewMenuItemOptions {
  itemName?: string;
  itemType?: 'page' | 'link';
  itemID?: string;
  itemLink?: string;
  itemColor?: TailwindColor | ThemeOptions;
  itemIntensity?: TailwindIntensity | false;
  itemHoverColor?: TailwindColor | ThemeOptions;
  itemHoverIntensity?: TailwindIntensity | false;
  itemActiveColor?: TailwindColor | ThemeOptions;
  itemActiveIntensity?: TailwindIntensity | false;
  itemEntranceAnimation?: EntranceAnimation;
  itemExitAnimation?: ExitAnimation;
  syncWithFooter?: boolean;
  skipPrompts?: boolean;
}

export interface EditMenuItemOptions {
  itemID?: string;
  itemName?: string;
  itemType?: 'page' | 'link';
  pageID?: string;
  itemLink?: string;
  itemColor?: TailwindColor | ThemeOptions;
  itemIntensity?: TailwindIntensity | false;
  itemHoverColor?: TailwindColor | ThemeOptions;
  itemHoverIntensity?: TailwindIntensity | false;
  itemActiveColor?: TailwindColor | ThemeOptions;
  itemActiveIntensity?: TailwindIntensity | false;
  itemEntranceAnimation?: EntranceAnimation;
  itemExitAnimation?: ExitAnimation;
  skipPrompts?: boolean;
}

export interface DeleteMenuItemOptions {
  itemID?: string;
  deleteFromFooter?: boolean;
  skipPrompts?: boolean;
}