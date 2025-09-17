import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DrawerProps, DrawerAction, DrawerLink } from "./drawerTypes";

const initialState: DrawerProps = {
    open: false,
    title: undefined,
    color: undefined,
    intensity: undefined,
    entrance: undefined,
    exit: undefined,
    action: [],
    link: [],
    orientation: "right",
};

const drawerSlice = createSlice({
    name: "drawer",
    initialState,
    reducers: {
        openDrawer: (state, action: PayloadAction<Omit<DrawerProps, "open">>) => {
            state.open = true;
            state.title = action.payload.title;
            state.color = action.payload.color;
            state.intensity = action.payload.intensity;
            state.entrance = action.payload.entrance;
            state.exit = action.payload.exit;
            state.action = action.payload.action || [];
            state.link = action.payload.link || [];
            state.orientation = action.payload.orientation || "right";
        },
        closeDrawer: (state) => {
            state.open = false;
            state.title = undefined;
            state.color = undefined;
            state.intensity = undefined;
            state.entrance = undefined;
            state.exit = undefined;
            state.action = [];
            state.link = [];
            state.orientation = "right";
        },
        setDrawerTitle: (state, action: PayloadAction<string | undefined>) => {
            state.title = action.payload;
        },
        setDrawerActions: (state, action: PayloadAction<DrawerAction[]>) => {
            state.action = action.payload;
        },
        setDrawerLinks: (state, action: PayloadAction<DrawerLink[]>) => {
            state.link = action.payload;
        },
        setDrawerOrientation: (state, action: PayloadAction<DrawerProps["orientation"]>) => {
            state.orientation = action.payload;
        },
    },
});

export const {
    openDrawer,
    closeDrawer,
    setDrawerTitle,
    setDrawerActions,
    setDrawerLinks,
    setDrawerOrientation,
} = drawerSlice.actions;

export default drawerSlice.reducer;
