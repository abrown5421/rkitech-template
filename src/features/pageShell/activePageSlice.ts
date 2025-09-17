import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActivePageState, PageShellProps } from "../../features/pageShell/pageShellTypes";

const initialState: ActivePageState = {
  activePageName: "Home",
  activePageIn: true,
  PageShellProps: {
    pageName: "Home",
    pageRenderMethod: "static",
    pageActive: true,
    pagePath: "/",
    pageColor: "blue",
    pageIntensity: 500,
    pageEntranceAnimation: "animate__fadeInUpBig",
    pageExitAnimation: "animate__fadeOutDownBig",
    pageContent: ""
  }
};

const activePageSlice = createSlice({
  name: "activePage",
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<PageShellProps>) => {
      state.activePageName = action.payload.pageName;
      state.PageShellProps = action.payload;
      state.activePageIn = true;
    },
    setActivePageIn: (state, action: PayloadAction<boolean>) => {
      state.activePageIn = action.payload;
    }
  }
});

export const { setActivePage, setActivePageIn } = activePageSlice.actions;
export default activePageSlice.reducer;
