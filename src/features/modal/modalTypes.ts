import type { TailwindColor, TailwindIntensity } from "../../app/globalTypes.ts/tailwindTypes";

export interface ModalProps {
    open: boolean;
    title: string;
    body: string;
    closeable: boolean;
    action: ModalAction[];
}

export interface ModalAction {
    actionName: string;
    actionColor: TailwindColor;
    actionIntensity: TailwindIntensity;
    actionTextColor?: TailwindColor;
    actionTextIntensity?: TailwindIntensity;
    actionFunction: (() => void) | (() => Promise<void>) | (() => any) | (() => Promise<any>);
}