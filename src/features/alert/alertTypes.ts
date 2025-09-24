import type { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components";

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
    color: TailwindColor;
    intensity: TailwindIntensity;
    textColor?: TailwindColor;
    textIntensity?: TailwindIntensity;
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    orientation?: AlertOrientation; 
}