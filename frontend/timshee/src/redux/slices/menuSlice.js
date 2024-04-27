import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
    name: "menu",
    initialState: {
        isActive: false,
        isAddressEditFormOpened: false,
    },
    reducers: {
        toggleMenu: (state) => {
            state.isActive = !state.isActive;
        },
        toggleAddressEditForm: (state) => {
            state.isAddressEditFormOpened = !state.isAddressEditFormOpened;
        },
    }
})

export const {toggleMenu, toggleAddressEditForm} = menuSlice.actions;
export default menuSlice.reducer;