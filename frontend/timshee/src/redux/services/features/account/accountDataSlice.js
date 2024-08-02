import {createSlice, current} from '@reduxjs/toolkit';

const accountDataSlice = createSlice({
    name: 'accountData',
    initialState: {
        // objects
        countries: [],
        provinces: [],
        phoneCodes: [],
        addresses: [],
        // controls
        isAddressFormOpened: false,
        // forms
        address: null,
    },
    reducers: {
        setLocationData: (state, action) => {
            const { countries, provinces, phoneCodes } = action.payload;
            state.countries = countries;
            state.provinces = provinces;
            state.phoneCodes = phoneCodes;
        },
        toggleAddressForm: (state) => {
            state.isAddressFormOpened = !state.isAddressFormOpened;
        },
        setAddress: (state, action) => {
            state.address = { ...action.payload };
        },
        // SCUD with addresses
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
        }
    }
});

export const {
    setLocationData,
    toggleAddressForm,
    setAddress,
    setAddresses,
    pushAddress,
    changeAddress,
    popAddress,
} = accountDataSlice.actions;
export default accountDataSlice.reducer;
export const selectAddress = (state) => state.accountData.address;
export const selectAddresses = (state) => state.accountData.addresses;
export const selectCountries = (state) => state.accountData.countries;
export const selectProvinces = (state) => state.accountData.provinces;
export const selectPhoneCodes = (state) => state.accountData.phoneCodes;