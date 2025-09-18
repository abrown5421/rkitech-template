import type { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components";

export type RenderMethod = "static" | "dynamic"

export interface ActivePageState {
    activePageName: string;
    activePageIn: boolean;
    PageShellProps: PageShellProps;
}

export interface PageShellProps {
    guid: string;
    pageName: string;
    pageRenderMethod: RenderMethod;
    pageActive: boolean;
    pagePath: string;
    pageColor: TailwindColor;
    pageIntensity: TailwindIntensity;
    pageEntranceAnimation: EntranceAnimation;
    pageExitAnimation: ExitAnimation;
    pageContent: string;
}