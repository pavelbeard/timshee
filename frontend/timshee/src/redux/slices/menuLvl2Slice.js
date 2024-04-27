import { createSlice } from "@reduxjs/toolkit";

export const menuLvl2Slice = createSlice({
    name: "menuLvl2",
    initialState: {
        isActive: false,
    },
    reducers: {
        toggleMenuLvl2: (state) => {
            state.isActive = !state.isActive;
        }
    }
})

export const {toggleMenuLvl2} = menuLvl2Slice.actions;
export default menuLvl2Slice.reducer;