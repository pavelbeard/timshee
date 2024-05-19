import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {deleteOrder} from "./checkout";

const initialState = {
    data: {},
    inStock: false,
    hasAdded: false,
    quantityOfCart: 0,
    cartItems: [],
    hasChanged: false,
    hasDeleted: false,
    collections: [],

    isLoading: false,
    error: null,
}

const API_URL = process.env.REACT_APP_API_URL;

export const checkInStock = createAsyncThunk(
    "items/checkInStock",
    async ({itemId, size, color}, thunkAPI) => {
        try {
            const url = [
                `${API_URL}api/store/stocks/`,
                `?item__id=${itemId}`,
                `&size__value=${size}`,
                `&color__name=${color}`
            ].join("");
            const response = await fetch(encodeURI(url), {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                const json = await response.json();

                if (parseInt(json[0]['in_stock']) !== 0) {
                    localStorage.setItem("selectedItem", JSON.stringify(json[0]));
                    return true;
                } else {
                    localStorage.removeItem("selectedItem");
                    return false;
                }

            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getCollections = createAsyncThunk(
    "items/getCollections",
    async (arg, thunkAPI) => {
        try {
            const url = `${API_URL}/api/store/collections/`;
            const response = await fetch(url);

            if (response.ok) {
                return await response.json();
            } else {
                return thunkAPI.rejectWithValue([]);
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const changeQuantity = createAsyncThunk(
    "items/changeQuantity",
    async ({itemSrc, increase, isAuthenticated}, thunkAPI) => {
        //
        // FOR UPGRADE
        const csrftoken = Cookies.get("csrftoken");
        try {
            const url = [API_URL,
                isAuthenticated
                    ? increase
                        ? `api/cart/cart-items/${itemSrc.id}/increase/`
                        : `api/cart/cart-items/${itemSrc.id}/decrease/`
                    : increase
                        ? `api/cart/anon-cart-items/${itemSrc.id}/increase/`
                        : `api/cart/anon-cart-items/${itemSrc.id}/decrease/`
            ].join("");

            const body = {
                "quantity_in_cart": 1,
                "cart": isAuthenticated
                    ? localStorage.getItem("cartId")
                    : localStorage.getItem("anonCartId"),
                "stock": itemSrc.stock.id,
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                    "Accept": "application/json",
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body),
                credentials: "include",
            });

            if (response.ok) {
                // MODIFY THAT CODE
                const json = await response.json();
                console.log(json);
                const quantityInCart = parseInt(json["quantity_in_cart"]);
                if (quantityInCart === 0) {
                    if (await deleteOrder(isAuthenticated)) {
                        localStorage.removeItem("order");
                    }
                }
                return quantityInCart;
            } else {
                return 0;
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const deleteCartItems = createAsyncThunk(
    "items/deleteCartItems",
    async ({isAuthenticated, itemId=0}, thunkAPI) => {
        const csrftoken = Cookies.get("csrftoken");
        const url = [
            API_URL,
            isAuthenticated
                ? itemId === 0
                    ? "api/cart/cart-items/delete_all/"
                    : `api/cart/cart-items/${itemId}/`
                : itemId === 0
                    ? "api/cart/anon-cart-items/delete_all/"
                    : `api/cart/anon-cart-items/${itemId}/`,
        ].join("");

        let body = {};
        if (!isAuthenticated) {
            body = {
                "anon_cart": localStorage.getItem("anonCartId"),
            };
        }

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                    "Accept": "application/json",
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body),
                credentials: "include",
            });

            if (response.ok) {
                await deleteOrder(isAuthenticated);
                return true;
            } else {
                thunkAPI.rejectWithValue(false);
            }
        } catch (e) {
            thunkAPI.rejectWithValue(false);
        }
    }
);

export const getCartItems = createAsyncThunk(
    "items/getCartItems",
    async({isAuthenticated}, thunkAPI) => {
        const cartId = localStorage.getItem("cartId") || localStorage.getItem("anonCartId");

        if (cartId === null || cartId === undefined) {
            return thunkAPI.rejectWithValue(null);
        }

        const url = [
            API_URL,
            isAuthenticated
                ? `api/cart/cart-items/?cart__id=${cartId}`
                : `api/cart/anon-cart-items/?anon_cart=${cartId}`,
        ].join("")

        try {
            const response = await fetch(url);
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

export const getQuantityOfCart = createAsyncThunk(
    "items/getQuantityOfCart",
    async ({isAuthenticated}, thunkAPI) => {
        const cartId = localStorage.getItem("cartId");
        const anonCartId = localStorage.getItem("anonCartId");

        let url;
        if (cartId && isAuthenticated) {
            url = `${API_URL}api/cart/cart-items/?cart__id=${cartId}`;
        } else if (anonCartId && !isAuthenticated) {
            url = `${API_URL}api/cart/anon-cart-items/?anon_cart=${anonCartId}`;
        } else {
            return;
        }

        try {
            const response = await fetch(url);

            if (response.ok) {
                const json = await response.json();
                const quantity = json.reduce((acc, item) => {
                    return acc + item.quantity_in_cart
                }, 0);
                return quantity;
            } else {
                return 0;
            }
        } catch (error) {
            thunkAPI.rejectWithValue(0);
        }
    }
);

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        setItemData: (state, action) => {
            localStorage.setItem("item", JSON.stringify(action.payload));
            state.data = action.payload;
        },
        setHasAdded: (state, action) => {
            state.hasAdded = action.payload;
        },
        setQuantityList: (state, action) => {
            state.quantityList = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuantityOfCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getQuantityOfCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quantityOfCart = action.payload;
            })
            .addCase(getQuantityOfCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.quantityOfCart = 0;
            })
            .addCase(getCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.cartItems = [];
            })
            .addCase(deleteCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasDeleted = action.payload;
            })
            .addCase(deleteCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasDeleted = false;
            })
            .addCase(changeQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changeQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasChanged = action.payload;
            })
            .addCase(changeQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasChanged = 0;
            })
            .addCase(getCollections.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCollections.fulfilled, (state, action) => {
                state.isLoading = false;
                state.collections = action.payload;
            })
            .addCase(getCollections.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.collections = [];
            })
            .addCase(checkInStock.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(checkInStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.inStock = action.payload;
            })
            .addCase(checkInStock.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.inStock = false;
            });
    }
});

export const {
    setItemData,
    setHasAdded,
    setQuantityList,
} = itemSlice.actions;
export default itemSlice.reducer;