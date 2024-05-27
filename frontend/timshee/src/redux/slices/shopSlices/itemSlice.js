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