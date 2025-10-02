import type { ThemeOptions } from "rkitech-components";
import { useAppSelector } from "../app/hooks";
import type { Theme } from "../cli/src/features/Theme/types/themeTypes";

export const useGetTheme = (themeKey: ThemeOptions) => {
  const theme = useAppSelector((state) => state.application.theme) as Theme;
  const colorObj = theme[themeKey];
  return `${colorObj.color}-${colorObj.intensity}`;
};

export const useGetFullTheme = () => {
  const theme = useAppSelector((state) => state.application.theme) as Theme;
  return theme; 
};