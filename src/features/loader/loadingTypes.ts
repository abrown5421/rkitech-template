import type { TailwindColor, TailwindIntensity } from "rkitech-components";

export interface LoadingState {
  [key: string]: boolean;
}

export interface LoaderProps {
  target: string; 
  type: "Dots" | "Bars" | "Spinner" | "Progress";
  variant: number;
  color: TailwindColor;
  intensity: TailwindIntensity;
  size: number;
}