import { TailwindColor, TailwindIntensity } from "rkitech-components"

export type ColorObject = {
    color: TailwindColor,
    intensity: TailwindIntensity
}

export interface Theme {
    primary: ColorObject,
    secondary: ColorObject,
    tertiary: ColorObject,
    quaternary: ColorObject,
    quinary: ColorObject,
    black: ColorObject,
    white: ColorObject,
}