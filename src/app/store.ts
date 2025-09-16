import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "../features/loader/loadingSlice";
import modalReducer from "../features/modal/modalSlice";
import activePageReducer from "./globalSlices/activePageSlice";

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    modal: modalReducer,
    activePage: activePageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;