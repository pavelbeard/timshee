import {createSlice, current} from '@reduxjs/toolkit';

const accountDataSlice = createSlice({
    name: 'accountData',
    initialState: {
        // location
        countries: [],
        provinces: [],
        phoneCodes: [],
        // addresses
        addresses: [],
        address: null,
        isAddressFormOpened: false,
        // orders
        orders: [],
    },
    reducers: {
        // location
        setLocationData: (state, action) => {
            const { countries, provinces, phoneCodes } = action.payload;
            state.countries = countries;
            state.provinces = provinces;
            state.phoneCodes = phoneCodes;
        },
        // addresses
        toggleAddressForm: (state) => {
            state.isAddressFormOpened = !state.isAddressFormOpened;
        },
        setAddress: (state, action) => {
            state.address = { ...action.payload };
        },
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
        pushAddress: (state, action) => {
            const copy = [...current(state).addresses];
            copy.push(action.payload);
            state.addresses = copy;
        },
        changeAddress: (state, action) => {
            const copy = [...current(state).addresses];
            state.addresses = copy.map(address => address.id === action.payload.id ? action.payload : address);
        },
        popAddress: (state, action) => {
            const copy = [...current(state).addresses];
            state.addresses = copy.filter(address => address.id !== action.payload.id );
        },
        // orders
        setOrders(state, action) {
            state.orders = action.payload;
        }
    }
});

export const {
    // location
    setLocationData,
    // addresses
    toggleAddressForm,
    setAddress,
    setAddresses,
    pushAddress,
    changeAddress,
    popAddress,
    // orders
    setOrders,
} = accountDataSlice.actions;
export default accountDataSlice.reducer;
export const selectCountries = (state) => state.accountData.countries;
export const selectProvinces = (state) => state.accountData.provinces;
export const selectPhoneCodes = (state) => state.accountData.phoneCodes;
export const selectAddresses = (state) => state.accountData.addresses;
export const selectAddress = (state) => state.accountData.address;
export const selectOrders = (state) => state.accountData.orders;
