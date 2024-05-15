import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    checkoutItems: [],
    isPendingForPayment: false,
    isLoading: false,
    error: null,
}

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = Cookies.get("csrftoken");


export const checkPendingForPay = createAsyncThunk(
    "order/checkPendingForPay",
    async ({isAuthenticated}, thunkAPI) => {
        let headers;
        if (isAuthenticated) {
            headers = {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("token")}`,
            };
        } else {
            headers = {
                "Content-Type": "application/json",
            }
        }

        try {
            const sessionKey = localStorage.getItem("sessionKey") || "";
            const response = await fetch(
                `${API_URL}api/order/check-pending-for-payment/?sessionKey=${sessionKey}`, {
                method: "GET",
                headers,
            });

            if (response.ok) {
                const json = await response.json();
                return json["is_not_there_any_pending"];
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({items, isAuthenticated}, thunkAPI) => {
        try {
            const copyItems = [...items];
            const filteredItems = copyItems.map((item) => {
                const {colors, sizes, ...newItem} = item.stock.item;
                const stock = item.stock;
                return {...item, stock: {...stock, item: newItem}};
            });
            console.log(filteredItems);

            let body;
            if (isAuthenticated) {
                body = JSON.stringify({
                    "ordered_items": filteredItems,
                    "status": "pending_for_pay",
                    "user": localStorage.getItem("userId"),
                });

            } else {
                body = JSON.stringify({
                    "ordered_items": filteredItems,
                    "status": "pending_for_pay",
                });
            }

            const url = [
                API_URL,
                isAuthenticated
                    ? "api/order/orders/"
                    : "api/order/anon-orders/",
            ].join("")
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                    "Accept": "application/json",
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                },
                body,
                credentials: "include",
            });
            return await response.json();
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checkoutItems = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(checkPendingForPay.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(checkPendingForPay.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pendingForPayment = action.payload;
            })
            .addCase(checkPendingForPay.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.pendingForPayment = action.payload;
            })
    }
});

export default orderSlice.reducer;



