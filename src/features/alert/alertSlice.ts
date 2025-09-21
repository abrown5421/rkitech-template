import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AlertProps, AlertOrientation } from "./alertTypes";
import type { TailwindColorOptions } from "rkitech-components";

const initialState: AlertProps = {
    open: false,
    body: "",
    closeable: true,
    color: {
        bg: {
            base: { color: "emerald", intensity: 500 }
        },
        text: {
            base: { color: "gray", intensity: 50 }
        },
        border: {
            base: { color: "emerald", intensity: 500 }
        }
    },
    entrance: "animate__slideInRight",
    exit: "animate__slideOutRight",
    orientation: "top-right", 
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
            state.entrance = action.payload.entrance;
            state.exit = action.payload.exit;
            state.orientation = action.payload.orientation;
        },
        closeAlert: (state) => {
            state.open = false;
            state.body = "";
            state.closeable = true;
            state.color = {
                bg: {
                    base: { color: "blue", intensity: 500 }
                },
                border: {
                    base: { color: "blue", intensity: 500 }
                }
            };
            state.entrance = undefined;
            state.exit = undefined;
            state.orientation = "bottom-right"; 
        },
        setAlertBody: (state, action: PayloadAction<string>) => {
            state.body = action.payload;
        },
        setAlertColor: (
            state,
            action: PayloadAction<TailwindColorOptions>
        ) => {
            state.color = action.payload;
        },
        setAlertOrientation: (state, action: PayloadAction<AlertOrientation>) => {
            state.orientation = action.payload;
        },
    },
});

export const {
    openAlert,
    closeAlert,
    setAlertBody,
    setAlertColor,
    setAlertOrientation, 
} = alertSlice.actions;

export default alertSlice.reducer;