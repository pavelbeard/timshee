import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { API_URL } from '../../../config';

const initialState = {
    data: {},
    inStock: 0,
    inStockStatus: 'idle',
    hasAdded: false,
    quantityOfCart: 0,
    items: [],
    itemDetail: undefined,
    itemDetailStatus: 'idle',
    cartItems: [],
    hasChanged: false,
    hasDeleted: false,
    collections: [],

    isLoading: false,
    error: null,
}


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
                const inStock = parseInt(json[0]?.in_stock);
                return inStock;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong!");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
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
                return thunkAPI.rejectWithValue("Not found");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
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
                state.inStockStatus = 'loading';
            })
            .addCase(checkInStock.fulfilled, (state, action) => {
                state.inStockStatus = 'success';
                state.inStock = action.payload;
            })
            .addCase(checkInStock.rejected, (state, action) => {
                state.inStockStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getItemDetail.pending, (state, action) => {
                state.itemDetailStatus = 'loading';
            })
            .addCase(getItemDetail.fulfilled, (state, action) => {
                state.itemDetailStatus = 'success';
                state.itemDetail = action.payload;
            })
            .addCase(getItemDetail.rejected, (state, action) => {
                state.itemDetailStatus = 'error';
            });
    }
});

export const {
    setItemData,
    setHasAdded,
} = itemSlice.actions;
export default itemSlice.reducer;