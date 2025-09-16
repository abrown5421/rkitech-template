import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActivePageState } from "../globalTypes/activePageTypes";

const initialState: ActivePageState = {
  activePageName: "Home",
  activePageIn: true,
};

const activePageSlice = createSlice({
  name: "activePage",
  initialState,
  reducers: {
    setActivePage(
      state,
      action: PayloadAction<{ name: string; in?: boolean }>
    ) {
      state.activePageName = action.payload.name;
      if (action.payload.in !== undefined) {
        state.activePageIn = action.payload.in;
      }
    },
    setPageIn(state, action: PayloadAction<boolean>) {
      state.activePageIn = action.payload;
    },
  },
});

export const { setActivePage, setPageIn } = activePageSlice.actions;
export default activePageSlice.reducer;
