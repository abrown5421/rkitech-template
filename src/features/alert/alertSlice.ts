import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AlertProps } from "./alertTypes";

const initialState: AlertProps = {
    open: false,
    body: "",
    closeable: true,
    color: "emerald",
    intensity: 500,
    textColor: "gray",
    textIntensity: 50,
    entrance: "animate__slideInRight",
    exit: "animate__slideOutRight",
};

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        openAlert: (state, action: PayloadAction<Omit<AlertProps, "open">>) => {
            state.open = true;
            state.body = action.payload.body;
            state.closeable = action.payload.closeable;
            state.color = action.payload.color;
            state.intensity = action.payload.intensity;
            state.textColor = action.payload.textColor;
            state.textIntensity = action.payload.textIntensity;
            state.entrance = action.payload.entrance;
            state.exit = action.payload.exit;
        },
        closeAlert: (state) => {
            state.open = false;
            state.body = "";
            state.closeable = true;
            state.color = "blue";
            state.intensity = 500;
            state.textColor = undefined;
            state.textIntensity = undefined;
            state.entrance = undefined;
            state.exit = undefined;
        },
        setAlertBody: (state, action: PayloadAction<string>) => {
            state.body = action.payload;
        },
        setAlertColor: (
            state,
            action: PayloadAction<{ color: AlertProps["color"]; intensity: AlertProps["intensity"] }>
        ) => {
            state.color = action.payload.color;
            state.intensity = action.payload.intensity;
        },
        setAlertTextColor: (
            state,
            action: PayloadAction<{ textColor: AlertProps["textColor"]; textIntensity: AlertProps["textIntensity"] }>
        ) => {
            state.textColor = action.payload.textColor;
            state.textIntensity = action.payload.textIntensity;
        },
    },
});

export const {
    openAlert,
    closeAlert,
    setAlertBody,
    setAlertColor,
    setAlertTextColor,
} = alertSlice.actions;

export default alertSlice.reducer;