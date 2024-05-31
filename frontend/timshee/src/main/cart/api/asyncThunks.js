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
    async ({data, isAuthenticated}, thunkAPI) => {
        try {
            const result = await createCartItem({data, isAuthenticated});

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

export const deleteCartItems = createAsyncThunk(
    "cart/deleteCartItems",
    async ({isAuthenticated, stockId=0,}, thunkAPI) => {
        try {
            const result = await destroyCartItems({
                isAuthenticated: isAuthenticated,
                stockId: stockId,
            });

            if (result) {
                console.log(result)
                return result;
            }
            else {
                console.log("ERROR")
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            console.log(error.message)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCartItems",
    async ({isAuthenticated, hasOrdered}, thunkAPI) => {
        try {
            const result = await destroyCart({isAuthenticated, hasOrdered});
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
    async ({itemSrc, decreaseStock, isAuthenticated, orderId=0}, thunkAPI) => {
        //
        // FOR UPGRADE
        try {
            const result = await updateQuantityInCart({
                itemSrc: itemSrc,
                decreaseStock: decreaseStock,
                isAuthenticated: isAuthenticated,
                orderId: orderId,
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