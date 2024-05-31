import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    getShippingAddresses as fetchShippingAddresses,
    getShippingAddressAsTrue as fetchShippingAddressAsTrue,
    getAddressDetail as fetchAddressDetail,
    getPhoneCodes as fetchPhoneCodes,
    getCountries as fetchCountries,
    getProvinces as fetchProvinces,
    getOrders as fetchOrders,
    getLastOrder as fetchLastOrder,
    getOrderDetail as fetchOrderDetail,
} from "../../../api/asyncFetchers";


// FOR ADDRESSES PAGE
export const getShippingAddresses = createAsyncThunk(
    "addressForm/getShippingAddresses",
    async ({isAuthenticated}, thunkAPI) => {
        try {
            const result = fetchShippingAddresses({isAuthenticated});
            if (result) {
                return result
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getShippingAddressAsTrue = createAsyncThunk(
    "addressForm/getShippingLastAddress",
    async ({isAuthenticated}, thunkAPI) => {
        try {
            const result = await fetchShippingAddressAsTrue({isAuthenticated});
            if (result) {
                console.log(result)
                return result
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getAddressDetail = createAsyncThunk(
    "addressForm/getAddressDetail",
    async ({addressId}, thunkAPI) => {
        try {
            const result = await fetchAddressDetail({addressId});
            if (result) {
                return result;
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getPhoneCodes = createAsyncThunk(
    "addressForm/getPhoneCodes",
    async (args, thunkAPI) => {
        try {
            const result = await fetchPhoneCodes();
            if (result) {
                return result;
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
);

export const getCountries = createAsyncThunk(
    "addressForm/getCountries",
    async (args, thunkAPI) => {
        try {
            const result = await fetchCountries();
            if (result) {
                return result;
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getProvinces = createAsyncThunk(
    "addressForm/getProvinces",
    async (args, thunkAPI) => {
        try {
            const result = await fetchProvinces();
            if (result) {
                return result;
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

// FOR ORDERS PAGE
export const getOrders = createAsyncThunk(
    "ordersPage/getOrders",
    async (args, thunkAPI) => {
        try {
            const result = await fetchOrders();
            if (result) {
                return result;
            } else {
                thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getLastOrder = createAsyncThunk(
    "ordersPage/getLastOrder",
    async (args, thunkAPI) => {
        try {
            const result = await fetchLastOrder();
            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const getOrderDetail = createAsyncThunk(
    "ordersPage/getOrderDetail",
    async ({orderId}, thunkAPI) => {
        try {
            const result = await fetchOrderDetail({orderId});
            if (result) {
                return result;
            } else {
                return  thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);