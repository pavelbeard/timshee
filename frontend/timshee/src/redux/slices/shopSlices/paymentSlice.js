import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    isFetching: false,
    error: null,
    redirectUrl: undefined,
};

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = Cookies.get("csrftoken");

export const createPaymentThunk = createAsyncThunk(
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
    extraReducers: builder => {

    }
});

export default paymentSlice.actions;
