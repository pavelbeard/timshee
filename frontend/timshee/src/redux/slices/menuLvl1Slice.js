import { createSlice } from "@reduxjs/toolkit";

export const menuLvl1Slice = createSlice({
    name: "menuLvl1",
    initialState: {
        isActive: false,
    },
    reducers: {
        toggleMenuLvl1: (state) => {
            state.isActive = !state.isActive;
        }
    }
})

export const {toggleMenuLvl1} = menuLvl1Slice.actions;
export default menuLvl1Slice.reducer;