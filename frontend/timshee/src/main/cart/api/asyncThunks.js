import {createAsyncThunk} from "@reduxjs/toolkit";

import {
    deleteCartItems as destroyCartItems,
    addCartItem as createCartItem,
    getCartItems as fetchCartItems,
    changeQuantityInCart as updateQuantityInCart,
} from "../../api/asyncFetchers";

export const addCartItem = createAsyncThunk(
    "cart/addCartItem",
    async ({data, isAuthenticated}, thunkAPI) => {
        try {
            const result = await createCartItem({data});

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
    "items/getCartItems",
    async({isAuthenticated}, thunkAPI) => {
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
    "items/deleteCartItems",
    async ({
               isAuthenticated,
               hasOrdered = false,
               stockId=0,
               orderId=0
           }, thunkAPI
    ) => {
        try {
            const result = await destroyCartItems({
                isAuthenticated: isAuthenticated,
                hasOrdered: hasOrdered,
                stockId: stockId,
                orderId: orderId,
            })

            if (result) {
                return result;
            }
            else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const changeQuantity = createAsyncThunk(
    "items/changeQuantity",
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

            if (result || result === 0) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);