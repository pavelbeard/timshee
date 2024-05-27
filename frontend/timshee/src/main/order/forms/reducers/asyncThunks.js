import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    getShippingAddressAsTrue as fetchShippingAddressAsTrue
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