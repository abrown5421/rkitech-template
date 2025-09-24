import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity } from "rkitech-components";

export type RenderMethod = 'static' | 'dynamic'

export interface PageData {
  pageName: string;
  pagePath: string;
  pageRenderMethod: RenderMethod;
  pageActive: boolean;
  pageColor: TailwindColor;
  pageIntensity: TailwindIntensity;
  pageEntranceAnimation: EntranceAnimation;
  pageExitAnimation: ExitAnimation;
  pageID: string;
}