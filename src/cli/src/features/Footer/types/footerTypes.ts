import { TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components";
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
};