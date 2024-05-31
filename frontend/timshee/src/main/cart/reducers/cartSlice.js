import {createSlice} from "@reduxjs/toolkit";
import {addCartItem, changeQuantity, clearCart, deleteCartItems, getCartItems} from "../api/asyncThunks";

const initialState = {
    isLoading: false,
    isError: false,
    error: null,

    hasDeleted: false,
    addCartItemStatus: 'idle',
    getCartItemsStatus: 'idle',
    deleteCartItemsStatus: 'idle',
    clearCartItemStatus: 'idle',
    changeQuantityStatus: 'idle',

    isAdded: 0,
    hasChanged: 0,
    cart: {
        cartItems: [],
        totalQuantityInCart: 0,
        totalPrice: 0,
        orderId: ""
    },
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetIsAdded: (state) => {
            state.isAdded = 0;
        },
        resetAddCartItemStatus: (state, action) => {
            state.addCartItemStatus = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addCartItem.pending, (state, action) => {
                state.addCartItemStatus = 'loading';
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                state.addCartItemStatus = 'success';
                state.cart = {
                    cartItems: action.payload['data'],
                    totalQuantityInCart: action.payload['total_quantity'],
                    totalPrice: action.payload['total_price'],
                    orderId: action.payload['order_id'],
                };
            })

            .addCase(getCartItems.pending, (state) => {
                state.getCartItemsStatus = 'loading';
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.getCartItemsStatus = 'success';
                state.cart = {
                    cartItems: action.payload['data'],
                    totalQuantityInCart: action.payload['total_quantity'],
                    totalPrice: action.payload['total_price'],
                    orderId: action.payload['order_id'],
                };
            })

            .addCase(deleteCartItems.pending, (state) => {
                state.deleteCartItemsStatus = 'loading';
            })
            .addCase(deleteCartItems.fulfilled, (state, action) => {
                state.deleteCartItemsStatus = 'success';
            })

            .addCase(changeQuantity.pending, (state) => {
                state.changeQuantityStatus = 'loading';
            })
            .addCase(changeQuantity.fulfilled, (state, action) => {
                state.changeQuantityStatus = 'success';
                state.cart = {
                    cartItems: action.payload['data'],
                    totalQuantityInCart: action.payload['total_quantity'],
                    totalPrice: action.payload['total_price'],
                    orderId: action.payload['order_id'],
                };
            })

            .addCase(clearCart.pending, (state, action) => {
                state.getCartItemsStatus = 'loading';
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.clearCartItemStatus = 'success';
                state.cart = {
                    cartItems: [],
                    totalQuantityInCart: 0,
                    totalPrice: 0.00,
                    orderId: 0,
                };
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.deleteCartItemsStatus = 'error';
            })

            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isError = true;
                    state.error = action.payload;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.isError = false;
                    state.error = null;
                }
            )
    }
});

export const {
    resetIsAdded,
    resetAddCartItemStatus,
} = cartSlice.actions;
export default cartSlice.reducer;