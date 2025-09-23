import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApplicationProps } from "./applicationTypes";
import type { Navbar } from "../../cli/src/features/Navbar/types/navTypes";
import type { PageData } from "../../cli/src/features/Pages/types/pageTypes";
import type { Footer } from "../../cli/src/features/Footer/types/footerTypes";

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
  },
});

export const { setNavbar, setPages, setFooter } = applicationSlice.actions;
export default applicationSlice.reducer;
