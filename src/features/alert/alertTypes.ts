import type { EntranceAnimation, ExitAnimation, TailwindColorObject } from "rkitech-components";

export type AlertOrientation =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export interface AlertProps {
    open: boolean;
    body: string;
    closeable: boolean;
    color: TailwindColorObject;
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    orientation?: AlertOrientation; 
}