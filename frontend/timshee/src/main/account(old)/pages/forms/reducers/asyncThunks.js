import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    getShippingAddresses as fetchShippingAddresses,
    getShippingAddressAsTrue as fetchShippingAddressAsTrue,
    getAddressDetail as fetchAddressDetail,
    createAddress as postAddress,
    updateAddress as putAddress,
    deleteAddress as extDeleteAddress,
    getPhoneCodes as fetchPhoneCodes,
    getCountries as fetchCountries,
    getProvinces as fetchProvinces,
    getOrders as fetchOrders,
    getLastOrder as fetchLastOrder,
    getOrderDetail as fetchOrderDetail,
    refundOrder as requestRefundOrder,
    changeEmail as putEmail,
    checkEmail as postCheckEmail,
    changePassword as postChangePassword,
    checkResetPasswordRequest as resetPasswordRequestValidation,
} from "../../../../api(old)/actions";


// FOR ADDRESSES PAGE
export const getAddresses = createAsyncThunk(
    "addressForm/getShippingAddresses",
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchShippingAddresses({token});
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

export const getAddressAsTrue = createAsyncThunk(
    "addressForm/getShippingLastAddress",
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchShippingAddressAsTrue({token});
            if (result) {
                console.log(result)
                return result
            } else {
               return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
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

export const createAddress = createAsyncThunk(
    "addressForm/createAddress",
    async ({token, data}, thunkAPI) => {
        try {
            const result = await postAddress({token, data});
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
export const updateAddress = createAsyncThunk(
    "addressForm/updateAddress",
    async ({token, addressId, data}, thunkAPI) => {
        try {
            const result = await putAddress({token, addressId, data});
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

export const deleteAddress = createAsyncThunk(
    "editAddress/deleteAddress",
    async ({token, addressId}, thunkAPI) => {
        try {
            const result = await extDeleteAddress({token, addressId});
            if (result) {
                return addressId;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return  thunkAPI.rejectWithValue(error.message);
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
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchOrders({token});
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

export const getLastOrder = createAsyncThunk(
    "ordersPage/getLastOrder",
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchLastOrder({token});
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

export const getOrderDetail = createAsyncThunk(
    "ordersPage/getOrderDetail",
    async ({orderId, token}, thunkAPI) => {
        try {
            const result = await fetchOrderDetail({orderId, token});
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

export const refundWhole = createAsyncThunk(
    "ordersPage/refundWhole",
    async ({orderNumber, data, token}, thunkAPI) => {
        try {
            const result = await requestRefundOrder({orderNumber, data, token, refundWhole: true});
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

export const refundPartial = createAsyncThunk(
    "ordersPage/refundPartial",
    async ({orderNumber, data, token}, thunkAPI) => {
        try {
            const result = await requestRefundOrder({orderNumber, data, token});
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

export const changeEmail = createAsyncThunk(
    "account/postNewEmail",
    async ({token, data}, thunkAPI) => {
        try {
            const result = await putEmail({token, data});

            if (result) {
                return data.email;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const checkEmail = createAsyncThunk(
    'account/checkEmail',
    async ({data}, thunkAPI) => {
        try {
            const result = await postCheckEmail({data});

            if (result) {
                return data.email;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const changePassword = createAsyncThunk(
    'account/changePassword',
    async ({data}, thunkAPI) => {
        try {
            const result = await postChangePassword({data});

            if (result) {
                return true;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const checkResetPasswordRequest = createAsyncThunk(
    'account/checkResetPasswordRequest',
    async ({data}, thunkAPI) => {
        try {
            const result = await resetPasswordRequestValidation({data});

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