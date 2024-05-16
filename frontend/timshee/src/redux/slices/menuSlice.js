import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
    name: "menu",
    initialState: {
        isActive: false,
        isAddressEditFormOpened: false,
        isCartClicked: false,
    },
    reducers: {
        toggleMenu: (state) => {
            state.isActive = !state.isActive;
        },
        toggleAddressEditForm: (state) => {
            state.isAddressEditFormOpened = !state.isAddressEditFormOpened;
        },
        toggleCart: (state) => {
            state.isCartClicked = !state.isCartClicked;
        },
        closeCart: (state) => {
            state.isCartClicked = false;
        }
    }
})

export const {
    toggleMenu,
    toggleAddressEditForm,
    toggleCart,
    closeCart,
} = menuSlice.actions;
export default menuSlice.reducer;