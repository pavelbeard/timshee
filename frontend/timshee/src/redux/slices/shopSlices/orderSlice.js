import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAddress, createOrder, updateAddress, updateOrder} from "./checkout";

const initialState = {
    orderData: {
        order: undefined,
        orders: [],
    },
    order: undefined,
    orders: [],
    orderId: 0,
    orderStates: {
        isOrderCreated: undefined,
        isOrderUpdated: undefined,
        isOrderPending: undefined,
    },
    steps: [
        {value: 1, step: "information"},
        {value: 2, step: "shipping"},
        {value: 3, step: "payment"},
    ],
    step: undefined,
    shippingMethodData: {
        shippingMethods: [],
        shippingMethod: undefined,
    },
    address: undefined,
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

export const checkout = createAsyncThunk(
    "order/checkout",
    async ({totalPrice, items, isAuthenticated}, thunkAPI) => {
        try {
            const createOrderResult = await createOrder(totalPrice, items, isAuthenticated);

            if (createOrderResult?.pending) {
                const updateOrderResult = await updateOrder({
                    orderId: createOrderResult.data.id, totalPrice, newItems: items, isAuthenticated
                });
                return updateOrderResult.id;
            }

            return createOrderResult.data.id;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateOrderShippingAddress = createAsyncThunk(
    "order/updateOrderShippingAddress",
    async ({orderId, shippingAddress, shippingAddressId, isAuthenticated}, thunkAPI) => {
        try {

            let address;
            if (shippingAddressId === undefined || shippingAddressId === "") {
                address = await createAddress({data: shippingAddress, isAuthenticated});
            } else {
                address = await updateAddress({shippingAddress, shippingAddressId, isAuthenticated});
            }

            if (address === undefined) {
                thunkAPI.rejectWithValue("Something went wrong...");
                return;
            }

            const result = await updateOrder({
                orderId, isAuthenticated, addData: {shippingAddressId: address.id},
            });


        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateOrderShippingMethod = createAsyncThunk(
    "order/updateOrderShippingMethod",
    async ({totalPrice, newItems, orderId, shippingMethodId, isAuthenticated}, thunkAPI) => {
        try {
            const result = await updateOrder({
                totalPrice, newItems, orderId, isAuthenticated, addData: {shippingMethodId: shippingMethodId}
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
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getOrders = createAsyncThunk(
    "order/getOrders",
    async ({isAuthenticated}, thunkAPI) => {
        try {
            let url = isAuthenticated
                ? `${API_URL}api/order/orders/`
                : `${API_URL}api/order/anon-orders/`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (response.status === 200) {
                return await response.json();
            } else {
                return [];
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getOrderDetail = createAsyncThunk(
    "order/getOrderDetail",
    async ({orderId, isAuthenticated}, thunkAPI) => {
        try {
            const url = isAuthenticated
                ? `${API_URL}api/order/orders/${orderId}/`
                : `${API_URL}api/order/anon-orders/${orderId}/`

            const headers = isAuthenticated ? {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("token")}`,
                "Accept": "application/json",
            } : {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };

            const response = await fetch(url, {
                method: "GET",
                headers,
                credentials: "include",
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);



export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrderId: (state, action) => {
            state.orderId = action.payload;
        },
        resetOrderId: (state) => {
            state.orderId = undefined;
        },
        setStep(state, action) {
            localStorage.setItem("step", JSON.stringify(action.payload));
            state.step = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkout.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(checkout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderId = action.payload;
            })
            .addCase(checkout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orderId = undefined;
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
            .addCase(getShippingMethods.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getShippingMethods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.shippingMethodData.shippingMethods = action.payload;
            })
            .addCase(getShippingMethods.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.shippingMethodData.shippingMethods = [];
            })
            .addCase(getShippingMethodDetail.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getShippingMethodDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.shippingMethodData.shippingMethod = action.payload;
            })
            .addCase(getShippingMethodDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.shippingMethodData.shippingMethod = undefined;
            })
            .addCase(getOrders.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            }).
            addCase(getOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orders = []
            })
            .addCase(getOrderDetail.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = action.payload;
            }).
            addCase(getOrderDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.order = undefined;
            })
            .addCase(updateOrderShippingMethod.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updateOrderShippingMethod.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = action.payload;
            }).
            addCase(updateOrderShippingMethod.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.order = undefined;
            });
    }
});

export const {
    setOrderId,
    resetOrderId,
    setStep,
} = orderSlice.actions;
export default orderSlice.reducer;



