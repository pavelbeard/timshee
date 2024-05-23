import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    isLoading: false,
    error: null,
    cart: {
        cartItems: [],
        totalQuantityInCart: 0,
        totalPrice: 0,
    },
    isCreated: false,
    isAdded: 0,
};

const csrftoken = Cookies.get("csrftoken");
const API_URL = process.env.REACT_APP_API_URL;

export const addCartItem = createAsyncThunk(
    "cart/addCartItem",
    async ({data, isAuthenticated}, thunkAPI) => {
        let url, headers, body;
        url = `${API_URL}api/cart/cart/`;

        headers = {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (response.status === 200 || response.status === 201) {
                const json = await response.json();
                return parseInt(json['quantity']);
            } else {
                return -1;
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getCartItems = createAsyncThunk(
    "items/getCartItems",
    async({isAuthenticated}, thunkAPI) => {
        const url = `${API_URL}api/cart/cart/`;

        try {
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                return await response.json();
            } else {
                thunkAPI.rejectWithValue(response.statusText);
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetIsAdded: (state) => {
            state.isAdded = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCartItem.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAdded += action.payload;
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAdded = 0;
            })
            .addCase(getCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.cartItems = action.payload;
                state.cart = {
                    cartItems: action.payload['data'],
                    totalQuantityInCart: action.payload['total_quantity'],
                    totalPrice: action.payload['total_price'],
                };
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                // state.cartItems = [];
                state.cart = {
                    cartItems: [],
                    totalQuantityInCart: 0,
                    totalPrice: 0,
                }
            })
    }
});

export const {
    resetIsAdded,
} = cartSlice.actions

export default cartSlice.reducer;