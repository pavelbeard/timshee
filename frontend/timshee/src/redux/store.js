import {configureStore} from '@reduxjs/toolkit';
import menuSlice from "./slices/menuSlice";
import searchSlice from "./slices/searchSlice";
import menuLvl1Slice from "./slices/menuLvl1Slice";
import menuLvl2Slice from "./slices/menuLvl2Slice";
import checkAuthSlice from "./slices/checkAuthSlice";
import editAddressSlice from "./slices/editAddressSlice";
import filtersSlice from "./slices/shopSlices/filtersSlice";
import itemSlice from "./slices/shopSlices/itemSlice";
import orderSlice from "./slices/shopSlices/orderSlice";
import cartSlice from "./slices/shopSlices/cartSlice";
import paymentSlice from "./slices/shopSlices/paymentSlice";

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
        payment: paymentSlice,
    }
});