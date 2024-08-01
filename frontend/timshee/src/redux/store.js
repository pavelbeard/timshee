import {configureStore} from '@reduxjs/toolkit';
import menuSlice from "./slices/menuSlice";
import searchSlice from "./slices/searchSlice";
import menuLvl1Slice from "./slices/menuLvl1Slice";
import menuLvl2Slice from "./slices/menuLvl2Slice";
import editAddressSlice from "./slices/editAddressSlice";
import itemSlice from "./slices/shopSlices/itemSlice";
import orderSlice from "../main/order/api/reducers/orderSlice";
import paymentSlice from "./slices/shopSlices/paymentSlice";
import shippingAddressFormSlice from "../main/order/checkout/pages/forms/reducers/shippingAddressFormSlice";
import checkoutSlice from "../main/order/api/reducers/checkoutSlice";
import addressFormSlice from "../main/account/pages/forms/reducers/addressFormSlice";
import ordersSlice from "../main/account/pages/forms/reducers/ordersSlice";
import cartSlice from "../main/cart/reducers/cartSlice";
import appSlice from "./slices/appSlice";
import shopSlice from "../main/shop/api/reducers/shopSlice";
import wishlistSlice from "../main/account/api/reducers/wishlistSlice";
import accountSlice from "../main/account/pages/forms/reducers/accountSlice";
import { apiSlice } from "./services/app/api/apiSlice";
import authReducer from "./services/features/auth/authSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,

        menu: menuSlice,
        search: searchSlice,
        menuLvl1: menuLvl1Slice,
        menuLvl2: menuLvl2Slice,
        editAddress: editAddressSlice,

        item: itemSlice,
        cart: cartSlice,
        order: orderSlice,
        checkout: checkoutSlice,
        payment: paymentSlice,
        addressForm: addressFormSlice,
        shippingAddressForm: shippingAddressFormSlice,
        ordersPage: ordersSlice,
        app: appSlice,
        shop: shopSlice,
        wishlist: wishlistSlice,
        account: accountSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});