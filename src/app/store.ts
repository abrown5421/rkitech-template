import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "../features/loader/loadingSlice";
import activePageReducer from "./globalSlices/activePageSlice";

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    activePage: activePageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;