import { TailwindColor, TailwindIntensity, ThemeOptions, EntranceAnimation, ExitAnimation } from "rkitech-components";
import { NavItem } from "../../../shared/types/navItemTypes.js";

export type FooterCopyright = {
  show: boolean;
  text: string;
};

export interface Footer {
  footerBgColor: TailwindColor | ThemeOptions;
  footerBgIntensity: TailwindIntensity | false;
  footerCopyright: FooterCopyright;
  footerPrimaryMenuItems: NavItem[];
  footerAuxilaryMenuItems: NavItem[];
}

export interface NewFooterMenuItemOptions {
  source: "main" | "aux";
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
  syncWithNavbar?: boolean;
  skipPrompts?: boolean;
}

export interface EditFooterMenuItemOptions {
  source: "main" | "aux";
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

export interface DeleteFooterMenuItemOptions {
  source: "main" | "aux";
  itemID?: string;
  deleteFromNavbar?: boolean;
  skipPrompts?: boolean;
}