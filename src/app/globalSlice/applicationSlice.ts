import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApplicationProps } from "./applicationTypes";
import type { Navbar } from "../../cli/src/features/Navbar/types/navTypes";
import type { PageData } from "../../cli/src/features/Pages/types/pageTypes";
import type { Footer } from "../../cli/src/features/Footer/types/footerTypes";
import type { Theme } from "../../cli/src/features/Theme/types/themeTypes";

const initialState: ApplicationProps = {
  pages: [],
  navbar: {
    navbarTitle: "",
    navbarBgColor: "gray",
    navbarBgIntensity: 50,
    navbarSticky: true,
    navbarLeftSectionAnimations: {
      entranceAnimation: "none",
      exitAnimation: "none",
    },
    navbarMenuItems: [],
  },
  footer: {
    footerBgColor: "gray",
    footerBgIntensity: 50,
    footerCopyright: {
      show: true,
      text: "",
    },
    footerPrimaryMenuItems: [],
    footerAuxilaryMenuItems: [],
  },
  theme: {
    primary: {
      color: "amber", 
      intensity: 500
    },
    secondary: {
      color: "amber", 
      intensity: 600
    },
    tertiary: {
      color: "amber", 
      intensity: 700
    },
    quaternary: {
      color: "amber", 
      intensity: 400
    },
    quinary: {
      color: "amber", 
      intensity: 300
    },
    black: {
      color: "gray", 
      intensity: 900
    },
    white: {
      color: "gray", 
      intensity: 50
    }
  }
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setNavbar(state, action: PayloadAction<Navbar>) {
      state.navbar = action.payload;
    },
    setPages(state, action: PayloadAction<PageData[]>) {
      state.pages = action.payload;
    },
    setFooter(state, action: PayloadAction<Footer>) {
      state.footer = action.payload;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
  },
});

export const { setNavbar, setPages, setFooter, setTheme } = applicationSlice.actions;
export default applicationSlice.reducer;
