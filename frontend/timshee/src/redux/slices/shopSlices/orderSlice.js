import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {itemSlice} from "./itemSlice";
import {checkPending, createOrder} from "./checkout";

const initialState = {
    order: undefined,
    orderStates: {
        isOrderCreated: undefined,
        isOrderPending: undefined,
    },
    isLoading: false,
    error: null,
}

const API_URL = process.env.REACT_APP_API_URL;


export const getPrimaryShippingAddress = createAsyncThunk(
    "order/getPrimaryShippingAddress",
    async ({isAuthenticated}, thunkAPI) => {
        let url;
        if (isAuthenticated) {
            url = `${API_URL}api/order/addresses/`;
        } else {
            url = `${API_URL}api/order/anonymousaddress/`;
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
    reducers: {
        resetIsPendingForPayment: (state) => {
            state.isPendingForPayment = undefined;
        }
    },
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
    }
});

export const {
    resetIsPendingForPayment,
} = itemSlice.actions;
export default orderSlice.reducer;



