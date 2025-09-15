import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoadingState } from "./loadingTypes";

const initialState: LoadingState = {};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    stopLoading: (state, action: PayloadAction<string>) => {
      state[action.payload] = false;
    },
    resetLoading: () => {
      return {};
    },
  },
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
