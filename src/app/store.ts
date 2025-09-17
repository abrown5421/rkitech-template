import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "../features/loader/loadingSlice";
import modalReducer from "../features/modal/modalSlice";
import alertReducer from "../features/alert/alertSlice";
import activePageReducer from "./globalSlices/activePageSlice";
import drawerReducer from '../features/drawer/drawerSlice';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    modal: modalReducer,
    alert: alertReducer,
    drawer: drawerReducer,
    activePage: activePageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;