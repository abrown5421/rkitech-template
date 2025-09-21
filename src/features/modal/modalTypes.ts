import type { EntranceAnimation, ExitAnimation, TailwindColorObject } from "rkitech-components";

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
    color: TailwindColorObject;
    actionFunction: (() => void) | (() => Promise<void>) | (() => any) | (() => Promise<any>);
}