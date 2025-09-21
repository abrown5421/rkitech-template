import type { ReactNode } from "react";
import type { EntranceAnimation, ExitAnimation, TailwindColorOptions } from "rkitech-components";

export type DrawerOrientation =
    | "top"
    | "right"
    | "bottom"
    | "left";

export interface DrawerProps {
    open: boolean;
    title?: string;
    color?: TailwindColorOptions;
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    action?: DrawerAction[];
    link?: DrawerLink[];
    orientation?: DrawerOrientation; 
}

export interface DrawerAction {
    actionName: string;
    color: TailwindColorOptions;
    actionFunction: (() => void) | (() => Promise<void>) | (() => any) | (() => Promise<any>);
}

export interface DrawerLink {
    linkName: string;
    linkIcon?: ReactNode;
    color?: TailwindColorOptions;
    linkFunction: (() => void) | (() => Promise<void>) | (() => any) | (() => Promise<any>);
}