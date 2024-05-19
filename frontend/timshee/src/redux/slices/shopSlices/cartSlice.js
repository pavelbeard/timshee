import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    isLoading: false,
    error: null,
    isCreated: false,
    isAdded: 0,
};

const csrftoken = Cookies.get("csrftoken");
const API_URL = process.env.REACT_APP_API_URL;

export const createCart = createAsyncThunk(
    'cart/createCart',
    async ({isAuthenticated}, thunkAPI) => {
        let url, body, headers;
        if (isAuthenticated) {
            body = {
                user: localStorage.getItem("userId"),
                id: localStorage.getItem("cartId"),
            };
            url = `${API_URL}api/cart/carts/`;
            headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Authorization": `Token ${localStorage.getItem("token")}`,
            };
        } else {
            body = {
                session: 0,
                id: localStorage.getItem("anonCartId"),
            };
            url = `${API_URL}api/cart/anon-carts/`;
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
                credentials: "include",
            });
            if (response.status === 200 || response.status === 201) {
                const json = await response.json();

                if (isAuthenticated) {
                    localStorage.setItem("cartId", json.id);
                } else {
                    localStorage.setItem("anonCartId", json.id);
                }

            } else {
                return false;
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

const increaseCartItem = async (isAuthenticated, itemId, headers, data) => {
    let url;

    if (isAuthenticated) {
        url = `${API_URL}api/cart/cart-items/${itemId}/increase/`;
    } else {
        url = `${API_URL}api/cart/anon-cart-items/${itemId}/increase/` ;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    return response.status === 200;
};

export const addCartItem = createAsyncThunk(
    "cart/addCartItem",
    async ({data, isAuthenticated}, thunkAPI) => {
        let url, headers, body;
        if (isAuthenticated) {
            url = `${API_URL}api/cart/cart-items/`;
        } else {
            url = `${API_URL}api/cart/anon-cart-items/`;
        }

        if (isAuthenticated) {
            headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Authorization": `Token ${localStorage.getItem("token")}`,
            };
        } else {
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (response.status === 200 || response.status === 201) {
                const json = await response.json();

                if (json['exist']) {
                    const isAdded = await increaseCartItem(isAuthenticated, json.id, headers, data);
                    return isAdded ? +1 : -1;
                } else {
                    return +1;
                }
            } else {
                return -1;
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
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
        builder.
            addCase(createCart.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(createCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isCreated = action.payload;
            })
            .addCase(createCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isCreated = false;
            })
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
    }
});

export const {
    resetIsAdded,
} = cartSlice.actions

export default cartSlice.reducer;