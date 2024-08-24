import {createSlice, current} from "@reduxjs/toolkit";
import {apiSlice} from "../../services/app/api/apiSlice";
import state from "../../../main/translate(old)/TranslateService";

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        address: null,
        addresses: [],
        orders: [],
        // countries: [],
        // provinces: [],
        // phoneCodes: [],
    },
    reducers: {
        setAddress: (state, action) => {
            state.address = { ...action.payload };
        },
        pushAddress: (state, action) => {
            state.addresses.push(action.payload);
        },
        changeAddress: (state, action) => {
            state.addresses = [...current(state).addresses].map(a =>
                a.id === action.payload.id ? action.payload : a
            );
        },
        removeAddress: (state, action) => {
            state.addresses = state.addresses.filter(a => a.id === action.payload.id);
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(apiSlice.endpoints.getAddressesByUser.matchFulfilled, (state, action) => {
                state.addresses = action?.payload;
            })
            .addMatcher(apiSlice.endpoints.getOrdersByUser.matchFulfilled, (state, action) => {
                state.orders = action?.payload;
            })
    }
});

export const {
    setAddress,
    pushAddress,
    changeAddress,
    removeAddress,
} = accountSlice.actions;
export default accountSlice.reducer;
export const selectCurrentAddress = state => state.account.address;
export const selectCurrentAddresses = state => state.account.addresses;
export const selectCurrentCountries = state => state.account.countries;
export const selectCurrentProvinces = state => state.account.provinces;
export const selectCurrentPhoneCodes = state => state.account.phoneCodes;
export const selectCurrentOrders = state => state.account.orders;