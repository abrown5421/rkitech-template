import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "../features/loader/loadingSlice";
import modalReducer from "../features/modal/modalSlice";
import alertReducer from "../features/alert/alertSlice";
import activePageReducer from "../features/pageShell/activePageSlice";
import drawerReducer from '../features/drawer/drawerSlice';
import applicationReducer from './globalSlice/applicationSlice';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    modal: modalReducer,
    alert: alertReducer,
    drawer: drawerReducer,
    activePage: activePageReducer,
    application: applicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;