import {createAsyncThunk} from "@reduxjs/toolkit";

import {
    deleteCartItems as destroyCartItems,
    addCartItem as createCartItem,
    getCartItems as fetchCartItems,
    changeQuantityInCart as updateQuantityInCart,
    clearCart as destroyCart,
} from "../../api/asyncFetchers";

export const addCartItem = createAsyncThunk(
    "cart/addCartItem",
    async ({data, token}, thunkAPI) => {
        try {
            const result = await createCartItem({data, token});

            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getCartItems = createAsyncThunk(
    "cart/getCartItems",
    async(arg, thunkAPI) => {
        try {
            const result = await fetchCartItems();

            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCartItems",
    async ({token, hasOrdered}, thunkAPI) => {
        try {
            const result = await destroyCart({token, hasOrdered});
            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const changeQuantity = createAsyncThunk(
    "cart/changeQuantity",
    async ({itemSrc, increaseStock, token, quantity=1}, thunkAPI) => {
        //
        // FOR UPGRADE
        try {
            const result = await updateQuantityInCart({
                itemSrc: itemSrc,
                increaseStock: increaseStock,
                token: token,
                quantity: quantity,
            });

            if (result) {
                return result;
            } else {
                console.log("ERROR")
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            console.log(error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export class deleteCartItems {
}