import {createAsyncThunk} from "@reduxjs/toolkit";

import {
    addToWishlist as postToWishlist,
    getWishlist as fetchWishlist,
    deleteWishlistItem as destroyWishlistItem,
} from "../../../api(old)/actions";

export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async ({token, data}, thunkAPI) => {
        try {
            const result = await postToWishlist({token, data});
            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);
export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchWishlist({token});
            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);

export const deleteWishlistItem = createAsyncThunk(
    'wishlist/deleteWishlistItem',
    async ({token, wishlistItemId}, thunkAPI) => {
        try {
            const result = await destroyWishlistItem({token, wishlistItemId});
            if (result) {
                return wishlistItemId;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);