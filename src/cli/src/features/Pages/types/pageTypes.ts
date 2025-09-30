import { EntranceAnimation, ExitAnimation, TailwindColor, TailwindIntensity, ThemeOptions } from "rkitech-components";

export type RenderMethod = 'static' | 'dynamic'

export interface PageData {
  pageName: string;
  pagePath: string;
  pageRenderMethod: RenderMethod;
  pageActive: boolean;
  pageColor: TailwindColor | ThemeOptions;
  pageIntensity: TailwindIntensity | false;
  pageEntranceAnimation: EntranceAnimation;
  pageExitAnimation: ExitAnimation;
  pageID: string;
}

export interface NewPageOptions {
  pageName?: string;
  pagePath?: string;
  pageRenderMethod?: 'static' | 'dynamic';
  pageActive?: boolean;
  pageColor?: TailwindColor | ThemeOptions;
  pageIntensity?: TailwindIntensity | false;
  pageEntranceAnimation?: EntranceAnimation;
  pageExitAnimation?: ExitAnimation;
  chosenTemplate?: string;
  skipPrompts?: boolean;
}
