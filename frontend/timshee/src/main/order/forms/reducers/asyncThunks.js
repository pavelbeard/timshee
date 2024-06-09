import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    getShippingAddresses as fetchShippingAddresses,
    getShippingAddressAsTrue as fetchShippingAddressAsTrue,
} from "../../../api/asyncFetchers";
import {getEmail} from "../../../account/api";

export const getShippingAddressAsTrue = createAsyncThunk(
    "shippingAddressForm/getShippingAddressAsTrue",
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchShippingAddressAsTrue({token});
            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getShippingAddresses = createAsyncThunk(
    "shippingAddressForm/getPrimaryShippingAddress",
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchShippingAddresses({token});
            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getUsernameEmail = createAsyncThunk(
    "shippingAddressForm/getUsernameEmail",
    async ({token}, thunkAPI) => {
        try {
            const result = await getEmail({token});

            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);