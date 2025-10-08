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
  itemStyle?: 'string' | 'button',
  itemID?: string;
  itemLink?: string;
  itemOrder?: number;
  itemColor?: TailwindColor | ThemeOptions;
  itemIntensity?: TailwindIntensity | false;
  itemHoverColor?: TailwindColor | ThemeOptions;
  itemHoverIntensity?: TailwindIntensity | false;
  itemBackgroundColor?: TailwindColor | ThemeOptions,
  itemBackgroundIntensity?: TailwindIntensity | false,
  itemBackgroundHoverColor?: TailwindColor | ThemeOptions,
  itemBackgroundHoverIntensity?: TailwindIntensity | false,
  itemActiveColor?: TailwindColor | ThemeOptions;
  itemActiveIntensity?: TailwindIntensity | false;
  itemBorderColor?: TailwindColor | ThemeOptions,
  itemBorderIntensity?: TailwindIntensity | false,
  itemBorderHoverColor?: TailwindColor | ThemeOptions,
  itemBorderHoverIntensity?: TailwindIntensity | false,
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
  itemStyle?: 'string' | 'button',
  pageID?: string;
  itemLink?: string;
  itemOrder?: number;
  itemColor?: TailwindColor | ThemeOptions;
  itemIntensity?: TailwindIntensity | false;
  itemHoverColor?: TailwindColor | ThemeOptions;
  itemHoverIntensity?: TailwindIntensity | false;
  itemBackgroundColor?: TailwindColor | ThemeOptions,
  itemBackgroundIntensity?: TailwindIntensity | false,
  itemBackgroundHoverColor?: TailwindColor | ThemeOptions,
  itemBackgroundHoverIntensity?: TailwindIntensity | false,
  itemActiveColor?: TailwindColor | ThemeOptions;
  itemActiveIntensity?: TailwindIntensity | false;  
  itemBorderColor?: TailwindColor | ThemeOptions,
  itemBorderIntensity?: TailwindIntensity | false,
  itemBorderHoverColor?: TailwindColor | ThemeOptions,
  itemBorderHoverIntensity?: TailwindIntensity | false,
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