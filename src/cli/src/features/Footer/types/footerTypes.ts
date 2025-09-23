import { TailwindColor, TailwindIntensity } from "rkitech-components";
import { NavItem } from "../../../shared/types/navItemTypes"

export type FooterCopyright = {
  show: boolean;
  text: string;
};

export interface Footer {
  footerBgColor: TailwindColor;
  footerBgIntensity: TailwindIntensity;
  footerCopyright: FooterCopyright;
  footerPrimaryMenuItems: NavItem[];
  footerAuxilaryMenuItems: NavItem[];
};