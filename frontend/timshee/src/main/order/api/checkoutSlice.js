import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    // general values
    isLoading: false,
    error: undefined,
    // light objects
    totalPrice: 0.00,
    // heavy objects
    orderedData: [],
};

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload;
        },
        setOrderedData: (state, action) => {
            state.orderedData = action.payload;
        },
    }
});

export const {
    setIsLoading,
    setError,
    setTotalPrice,
    setOrderedData,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;