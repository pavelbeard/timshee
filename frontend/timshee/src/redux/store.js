import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/store/accountSlice";
import authReducer from "./features/store/authSlice";
import cartReducer from "./features/store/cartSlice";
import paymentReducer from "./features/store/paymentSlice";
import storeReducer from "./features/store/storeSlice";
import uiControlsReducer from "./features/store/uiControlsSlice";
import { apiSlice } from "./services/app/api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    ui: uiControlsReducer,
    auth: authReducer,
    account: accountReducer,
    store: storeReducer,
    cart: cartReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
