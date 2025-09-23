import type { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components";

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
}