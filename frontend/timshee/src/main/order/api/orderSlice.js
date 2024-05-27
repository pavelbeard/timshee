import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    order: undefined,
}

const apiOrderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrder: (state, action) => {
            state.order = action.payload;
        }
    }
});

export const {
    setOrder
} = apiOrderSlice.actions;
