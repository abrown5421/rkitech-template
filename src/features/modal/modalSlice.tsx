
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ModalAction, ModalProps } from "./modalTypes";

const initialState: ModalProps = {
    open: false,
    title: "",
    body: "",
    closeable: true,
    entrance: undefined,
    exit: undefined,
    action: [],
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<Omit<ModalProps, "open">>) => {
            state.open = true;
            state.title = action.payload.title;
            state.body = action.payload.body;
            state.closeable = action.payload.closeable;
            state.action = action.payload.action;
            state.entrance = action.payload.entrance;
            state.exit = action.payload.exit; 
        },
        closeModal: (state) => {
            state.open = false;
            state.title = "";
            state.body = "";
            state.closeable = true;
            state.action = [];
            state.entrance = undefined;
            state.exit = undefined;
        },
        setModalTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setModalBody: (state, action: PayloadAction<string>) => {
            state.body = action.payload;
        },
        setModalActions: (state, action: PayloadAction<ModalAction[]>) => {
            state.action = action.payload;
        },
    },
});

export const { openModal, closeModal, setModalTitle, setModalBody, setModalActions } = modalSlice.actions;

export default modalSlice.reducer;
