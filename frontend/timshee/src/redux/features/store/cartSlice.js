import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../services/app/api/apiSlice";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0.0,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.getCartItems.matchFulfilled,
        (state, action) => {
          state.cartItems = action?.payload?.cart_items || [];
          state.totalQuantity = action?.payload?.total_items || 0;
          state.totalPrice = action?.payload?.total || 0.0;
        },
      )
      .addMatcher(
        apiSlice.endpoints.addItemsToOrder.matchFulfilled,
        (state, action) => {
          state.orderId = action?.payload?.detail;
        },
      );
  },
});

export const {} = cartSlice.actions;
export default cartSlice.reducer;
export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
export const selectTotalPrice = (state) => state.cart.totalPrice;
export const selectOrderId = (state) => state.cart.orderId;
