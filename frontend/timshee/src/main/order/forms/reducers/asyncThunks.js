import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    getShippingAddresses as fetchShippingAddresses,
    getShippingAddressAsTrue as fetchShippingAddressAsTrue,
} from "../../../api/asyncFetchers";

export const getShippingAddressAsTrue = createAsyncThunk(
    "shippingAddressForm/getShippingAddressAsTrue",
    async ({isAuthenticated}, thunkAPI) => {
        try {
            const result = await fetchShippingAddressAsTrue({isAuthenticated});
            if (result) {
                return result
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getShippingAddresses = createAsyncThunk(
    "shippingAddressForm/getPrimaryShippingAddress",
    async ({isAuthenticated}, thunkAPI) => {
        try {
            const result = await fetchShippingAddresses({isAuthenticated});
            if (result) {
                return result;
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            thunkAPI.rejectWithValue(error.message);
        }
    }
);