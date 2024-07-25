import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    isFetching: false,
    error: null,
    redirectUrl: undefined,
};
createAsyncThunk(
    "payment/createPaymentThunk",
    async ({orderId}, thunkAPI) => {
        try {

        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);
const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: () => {

    }
});

export default paymentSlice.actions;
