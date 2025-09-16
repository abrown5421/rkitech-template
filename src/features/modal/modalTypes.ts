import type { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components";

export interface ModalProps {
    open: boolean;
    title: string;
    body: string;
    closeable: boolean;
    action: ModalAction[];
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
}

export interface ModalAction {
    actionName: string;
    actionColor: TailwindColor;
    actionIntensity: TailwindIntensity;
    actionTextColor?: TailwindColor;
    actionTextIntensity?: TailwindIntensity;
    actionFunction: (() => void) | (() => Promise<void>) | (() => any) | (() => Promise<any>);
}