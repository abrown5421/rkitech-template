import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApplicationProps } from "./applicationTypes";
import type { Navbar } from "../../cli/src/features/Navbar/types/navTypes";
import type { PageData } from "../../cli/src/features/Pages/types/pageTypes";

const initialState: ApplicationProps = {
  pages: [],
  navbar: {
    navbarTitle: "",
    navbarBgColor: "gray",
<<<<<<< Updated upstream
    navbarBgIntensity: 50, 
=======
    navbarBgIntensity: 50,
    navbarSticky: true,
>>>>>>> Stashed changes
    navbarLeftSectionAnimations: {
      entranceAnimation: "none",
      exitAnimation: "none",
    },
    navbarMenuItems: [],
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
  },
});

export const { setNavbar, setPages } = applicationSlice.actions;
export default applicationSlice.reducer;
