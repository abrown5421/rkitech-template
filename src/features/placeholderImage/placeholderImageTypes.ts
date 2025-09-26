import type { ColorObject } from "../../cli/src/features/Theme/types/themeTypes";

export interface PlaceholderImageProps {
    src?: string,
    width: string | number,
    height: string | number,
    cellSize: number,
    variance: number,
    xColors: ColorObject[],
    yColors: ColorObject[],
}