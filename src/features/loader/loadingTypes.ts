export interface LoadingState {
  [key: string]: boolean;
}

export interface LoaderProps {
  target: string; 
  type: "Dots" | "Bars" | "Spinner" | "Progress";
  variant: number;
}