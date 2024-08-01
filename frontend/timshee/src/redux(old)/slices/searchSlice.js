import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        isActive: false,
    },
    reducers: {
        toggleSearch: (state) => {
            state.isActive = !state.isActive;
        }
    }
})

export const {toggleSearch} = searchSlice.actions;
export default searchSlice.reducer;