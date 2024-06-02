import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    updatePaymentInfo as putPaymentInfo,
    createOrUpdateAddress as postOrPutAddress
} from "./index";
import {deleteOrder as destroyOrder} from "../../api/asyncFetchers";
import {createAddress, updateAddress, updateOrder} from "../../../redux/slices/shopSlices/checkout";
import AuthService from "../../api/authService";

const API_URL = process.env.REACT_APP_API_URL;
const token = AuthService.getCurrentUser();

// CHECKOUT INIT
export const getPhoneCodes = createAsyncThunk(
    "order/getPhoneCodes",
    async (args, thunkAPI) => {
        try {
            const url = `${API_URL}api/order/phone-codes/`;
            const response = await fetch(url, {
                credentials: "include",
            });

            if (response.status === 200) {
                return  await response.json();
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
);

export const getCountries = createAsyncThunk(
    "order/getCountries",
    async (args, thunkAPI) => {
        try {
            const url = `${API_URL}api/order/countries/`;
            const response = await fetch(url, {
                credentials: "include",
            });

            if (response.status === 200) {
                return  await response.json();
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
);

export const getProvinces = createAsyncThunk(
    "order/getProvinces",
    async (args, thunkAPI) => {
        try {
            const url = `${API_URL}api/order/provinces/`;
            const response = await fetch(url, {
                credentials: "include",
            });

            if (response.status === 200) {
                return  await response.json();
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
);


export const getShippingMethods = createAsyncThunk(
    "order/getShippingMethods",
    async (arg, thunkAPI) => {
        let url = `${API_URL}api/order/shipping-methods/`;

        try {
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                return await response.json();
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
);

export const getShippingMethodDetail = createAsyncThunk(
    "order/getShippingMethodDetail",
    async ({shippingMethodId}, thunkAPI) => {
        if (shippingMethodId === 0) {
            return;
        }

        let url = `${API_URL}api/order/shipping-methods/${shippingMethodId}/`;

        try {
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                return await response.json();
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
);


// CHECKOUT STEPS
export const updatePaymentInfo = createAsyncThunk(
    "checkout/updatePaymentInfo",
    async ({storeOrderNumber, data, setError, setIsLoading}, thunkAPI) => {
        try {
            const result = await putPaymentInfo({storeOrderNumber, data, setError, setIsLoading});

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

export const deleteOrder = createAsyncThunk(
    "checkout/deleteOrder",
    async ({orderId, isAuthenticated, setError, setIsLoading}, thunkAPI) => {
        try {
            const result = await destroyOrder({orderId, isAuthenticated});

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

export const createOrUpdateAddress = createAsyncThunk(
    "checkout/createOrUpdateAddress",
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

export const createOrUpdateShippingMethod = createAsyncThunk(
    "checkout/createOrUpdateShippingMethod",
    async ({isAuthenticated}, thunkAPI) => {
        try {

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateOrderShippingMethod = createAsyncThunk(
    "order/updateOrderShippingMethod",
    async ({totalPrice, newItems, orderId, shippingMethodId, token}, thunkAPI) => {
        try {
            const result = await updateOrder({
                totalPrice, newItems, orderId, token, addData: {shippingMethodId: shippingMethodId}
            });

            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return  thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({orderId, isAuthenticated, status}, thunkAPI) => {
        try {
            await updateOrder({
                orderId: orderId,
                isAuthenticated: isAuthenticated,
                status: status
            });
        } catch (e) {
           return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getOrderDetail = createAsyncThunk(
    "order/getOrderDetail",
    async ({orderId, token}, thunkAPI) => {
        try {
            const url = `${API_URL}api/order/orders/${orderId}/`;
            let headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };

            if (token?.access) {
                headers["Authorization"] = `Bearer ${token?.access}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers,
                credentials: "include",
            });
            if (response.ok) {
                return await response.json();
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return  thunkAPI.rejectWithValue(error.message);
        }
    }
);