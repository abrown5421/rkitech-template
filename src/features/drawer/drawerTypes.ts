import type { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components";

export type DrawerOrientation =
    | "top"
    | "right"
    | "bottom"
    | "left";

export interface DrawerProps {
    open: boolean;
    title?: string;
    color?: TailwindColor;
    intensity?: TailwindIntensity;
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    action?: DrawerAction[];
    link?: DrawerLink[];
    orientation?: DrawerOrientation; 
}

export interface DrawerAction {
    actionName: string;
    actionColor: TailwindColor;
    actionIntensity: TailwindIntensity;
    actionTextColor?: TailwindColor;
    actionTextIntensity?: TailwindIntensity;
    actionFunction: (() => void) | (() => Promise<void>) | (() => any) | (() => Promise<any>);
}

export interface DrawerLink {
    linkName: string;
    linkTextColor?: TailwindColor;
    linkTextIntensity?: TailwindIntensity;
    linkFunction: (() => void) | (() => Promise<void>) | (() => any) | (() => Promise<any>);
}