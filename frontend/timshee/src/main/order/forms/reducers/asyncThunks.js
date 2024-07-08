import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    getShippingAddresses as fetchShippingAddresses,
    getShippingAddressAsTrue as fetchShippingAddressAsTrue,
} from "../../../api/actions";
import {getEmail} from "../../../account/api";
import {createOrUpdateAddress as postOrPutAddress} from "../../api";

export const createOrUpdateAddress = createAsyncThunk(
    "shippingAddressForm/createOrUpdateAddress",
    async ({shippingAddress, shippingAddressId=0, token}, thunkAPI) => {
        try {
            const result = await postOrPutAddress({shippingAddress, shippingAddressId, token});

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