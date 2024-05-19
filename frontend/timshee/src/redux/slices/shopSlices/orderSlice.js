import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {itemSlice} from "./itemSlice";
import {checkPending, createOrder} from "./checkout";

const initialState = {
    order: undefined,
    orderStates: {
        isOrderCreated: undefined,
        isOrderPending: undefined,
    },
    addresses: [],
    countries: [],
    provinces: [],
    phoneCodes: [],
    isLoading: false,
    error: null,
}

const API_URL = process.env.REACT_APP_API_URL;

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


export const getShippingAddress = createAsyncThunk(
    "order/getPrimaryShippingAddress",
    async ({isAuthenticated}, thunkAPI) => {
        let url;
        if (isAuthenticated) {
            const userId = localStorage.getItem("userId");
            url = `${API_URL}api/order/addresses/?user__id=${userId}`;
        }

        if (isAuthenticated) {
            try {
                const response = await fetch(url, {
                    credentials: "include",
                });

                if (response.status === 200) {
                    return await response.json();
                }
            } catch (e) {
                return thunkAPI.rejectWithValue(e)
            }
        }

    }
);

export const checkout = createAsyncThunk(
    "order/checkout",
    async ({items, isAuthenticated}, thunkAPI) => {
        try {
            const pending = await checkPending(isAuthenticated);

            if (pending) {
                return {isOrderCreated: undefined, isOrderPending: pending};
            } else {
                const result = await createOrder(items, isAuthenticated);
                localStorage.setItem("order", JSON.stringify(result));

                return {isOrderCreated: undefined, isOrderPending: pending};
            }

        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkout.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(checkout.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload);
                state.orderStates = action.payload;
            })
            .addCase(checkout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orderStates = {
                    isOrderCreated: undefined,
                    isOrderPending: undefined,
                };
            })
            .addCase(getShippingAddress.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getShippingAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addresses = action.payload;
            })
            .addCase(getShippingAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.addresses = [];
            })
            .addCase(getCountries.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getCountries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.countries = action.payload;
            })
            .addCase(getCountries.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.countries = [];
            })
            .addCase(getProvinces.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getProvinces.fulfilled, (state, action) => {
                state.isLoading = false;
                state.provinces = action.payload;
            })
            .addCase(getProvinces.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.provinces = [];
            })
            .addCase(getPhoneCodes.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getPhoneCodes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.phoneCodes = action.payload;
            })
            .addCase(getPhoneCodes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.phoneCodes = [];
            })
    }
});

export default orderSlice.reducer;



