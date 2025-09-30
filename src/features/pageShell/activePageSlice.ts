import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActivePageState } from "../../features/pageShell/pageShellTypes";
import type { PageData } from "../../cli/src/features/Pages/types/pageTypes";

const initialState: ActivePageState = {
  activePageName: "Home",
  activePageIn: true,
  pageShellProps: {
    pageID: '',
    pageName: "Home",
    pageRenderMethod: "static",
    pageActive: true,
    pagePath: "/",
    pageColor: "blue",
    pageIntensity: 500,
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  }
};

const activePageSlice = createSlice({
  name: "activePage",
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<PageData>) => {
      state.activePageName = action.payload.pageName;
      state.pageShellProps = action.payload;
      state.activePageIn = true;
    },
    setActivePageIn: (state, action: PayloadAction<boolean>) => {
      state.activePageIn = action.payload;
    }
  }
});

export const { setActivePage, setActivePageIn } = activePageSlice.actions;
export default activePageSlice.reducer;
