import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {deleteOrder} from "./checkout";

const initialState = {
    data: {},
    inStock: false,
    hasAdded: false,
    quantityOfCart: 0,
    items: [],
    itemDetail: undefined,
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
                `&size__id=${size}`,
                `&color__id=${color}`
            ].join("");
            const response = await fetch(encodeURI(url), {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const json = await response.json();
                const inStock = parseInt(json[0]?.in_stock || 0) !== 0;
                return inStock;
            } else {
                return response.statusText;
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getItemDetail = createAsyncThunk(
    "items/getItemDetail",
    async ({itemId}, thunkAPI) => {
        try {
            const url = `${API_URL}api/store/items/${itemId}/`;
            const response = await fetch(encodeURI(url), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                return await response.json();
            } else {
                return {};
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
    async ({itemSrc, decreaseStock, isAuthenticated, orderId=0}, thunkAPI) => {
        //
        // FOR UPGRADE
        const csrftoken = Cookies.get("csrftoken");
        try {
            const url = `${API_URL}api/cart/cart/`;
            const headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                // "Authorization": `Token ${localStorage.getItem("token")}`,
            }
            const body = {
                "stock_id": itemSrc.stock.id,
                "quantity": 1,
                "increase": decreaseStock
            }

            const response = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify(body),
                credentials: "include",
            });

            if (response.status === 200) {
                // MODIFY THAT CODE
                const json = await response.json();
                return parseInt(json["quantity"]);
            } else if (response.status === 204) {
                if (orderId !== 0) {
                    await deleteOrder({isAuthenticated, orderId})
                }
                return 0;
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const deleteCartItems = createAsyncThunk(
    "items/deleteCartItems",
    async ({
               isAuthenticated, hasOrdered = false, stockId=0, orderId=0
           }, thunkAPI) => {
        const csrftoken = Cookies.get("csrftoken");
        const url = `${API_URL}api/cart/cart/`;

        let body;
        if (stockId === 0 && !hasOrdered) {
            body = {
                "clear": true
            }
        } else if (hasOrdered) {
            body = {
                "clear_by_has_ordered": true,
            }
        } else {
            body = {
                "stock_id": stockId,
                "remove": true
            };
        }

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                    "Accept": "application/json",
                },
                body: JSON.stringify(body),
                credentials: "include",
            });

            if (response.ok) {
                if (orderId !== 0) {
                    await deleteOrder({isAuthenticated, orderId});
                    localStorage.removeItem("order");
                }
                return true;
            } else {
                thunkAPI.rejectWithValue(false);
            }
        } catch (e) {
            thunkAPI.rejectWithValue(false);
        }
    }
);



export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        setItemData: (state, action) => {
            state.data = action.payload;
        },
        setHasAdded: (state, action) => {
            state.hasAdded = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
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
            })
            .addCase(getItemDetail.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getItemDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.itemDetail = action.payload;
            })
            .addCase(getItemDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.itemDetail = undefined;
            });
    }
});

export const {
    setItemData,
    setHasAdded,
} = itemSlice.actions;
export default itemSlice.reducer;