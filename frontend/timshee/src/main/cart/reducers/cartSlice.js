import {createSlice} from "@reduxjs/toolkit";
import {addCartItem, changeQuantity, deleteCartItems, getCartItems} from "../api/asyncThunks";

const initialState = {
    isLoading: false,
    isError: false,
    hasDeleted: false,

    isAdded: 0,
    hasChanged: 0,
    cart: {
        cartItems: [],
        totalQuantityInCart: 0,
        totalPrice: 0,
    },
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetIsAdded: (state) => {
            state.isAdded = 0;
        }
    },
    extraReducers: builder => {
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
                state.cart = {
                    cartItems: action.payload['data'],
                    totalQuantityInCart: action.payload['total_quantity'],
                    totalPrice: action.payload['total_price'],
                };
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.cart = {
                    cartItems: [],
                    totalQuantityInCart: 0,
                    totalPrice: 0,
                };
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
                state.isError = action.payload;
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
    }
});

export const {
    resetIsAdded,
} = cartSlice.actions;
export default cartSlice.reducer;