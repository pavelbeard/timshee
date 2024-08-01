import { createSlice } from "@reduxjs/toolkit";

export const menuLvl1Slice = createSlice({
    name: "menuLvl1",
    initialState: {
        isActive: false,
    },
    reducers: {

    }
})

export const {toggleMenuLvl1} = menuLvl1Slice.actions;
export default menuLvl1Slice.reducer;