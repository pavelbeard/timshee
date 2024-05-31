import {configureStore} from '@reduxjs/toolkit';
import menuSlice from "./slices/menuSlice";
import searchSlice from "./slices/searchSlice";
import menuLvl1Slice from "./slices/menuLvl1Slice";
import menuLvl2Slice from "./slices/menuLvl2Slice";
import checkAuthSlice from "./slices/checkAuthSlice";
import editAddressSlice from "./slices/editAddressSlice";
import filtersSlice from "./slices/shopSlices/filtersSlice";
import itemSlice from "./slices/shopSlices/itemSlice";
import orderSlice from "../main/order/api/reducers/orderSlice";
import paymentSlice from "./slices/shopSlices/paymentSlice";
import shippingAddressFormSlice from "../main/order/forms/reducers/shippingAddressFormSlice";
import checkoutSlice from "../main/order/api/reducers/checkoutSlice";
import addressFormSlice from "../main/account/forms/reducers/addressFormSlice";
import ordersSlice from "../main/account/forms/reducers/ordersSlice";
import cartSlice from "../main/cart/reducers/cartSlice";

export default configureStore({
    reducer: {
        menu: menuSlice,
        search: searchSlice,
        menuLvl1: menuLvl1Slice,
        menuLvl2: menuLvl2Slice,
        auth: checkAuthSlice,
        editAddress: editAddressSlice,

        filters: filtersSlice,
        item: itemSlice,
        cart: cartSlice,
        order: orderSlice,
        checkout: checkoutSlice,
        payment: paymentSlice,
        addressForm: addressFormSlice,
        shippingAddressForm: shippingAddressFormSlice,
        ordersPage: ordersSlice,
    }
});