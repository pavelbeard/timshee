import {createSlice} from "@reduxjs/toolkit";
import {
    getAddressDetail,
    getCountries,
    getPhoneCodes,
    getProvinces,
    getShippingAddressAsTrue,
    getShippingAddresses
} from "./asyncThunks";

let addressObject = {
    id: 0,
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    postalCode: "",
    city: "",
    province: {
        id: 0,
        name: "",
        country: {
            id: 0,
            name: ""
        }
    },
    phoneCode: {
        country: 0,
        phoneCode: "",
    },
    phoneNumber: "",
    email: "",
    asPrimary: false,
};

const initialState = {
    // general values
    isLoading: false,
    isError: undefined,
    // light values
    // heavy values
    addressObject,
    addressDetailStatus: 'idle',
    addressAsTrueStatus: 'idle',
    addressFormObject: {
        ...addressObject
    },
    addresses: [],
    shippingAddressesStatus: 'idle',
    countries: [],
    provinces: [],
    phoneCodes: [],
    provincesFilteredList: [],
    phoneCodesFilteredList: [],
};

const addressFormSlice = createSlice({
    name: "addressForm",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setProvincesFiltered: (state, action) => {
            state.provincesFilteredList = action.payload;
        },
        setPhoneCodesFiltered: (state, action) => {
            state.phoneCodesFilteredList = action.payload;
        },
        setProvince: (state, action) => {
            state.addressFormObject = {
                ...state.addressFormObject,
                province: action.payload,
            }
        },
        setPhoneCode: (state, action) => {
            state.addressFormObject = {
                ...state.addressFormObject,
                phoneCode: action.payload,
            }
        },
        // edit form
        editAddress: (state, action) => {
            console.log(action.payload);
            state.addressFormObject = {
                ...state.addressFormObject,
                id: action.payload.id,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                streetAddress: action.payload.streetAddress,
                apartment: action.payload.apartment,
                postalCode: action.payload.postalCode,
                city: action.payload.city,
                phoneNumber: action.payload.phoneNumber,
                province: action.payload.province,
                phoneCode: action.payload.phoneCode,
                asPrimary: action.payload.asPrimary,
                email: action.payload.email,
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getShippingAddresses.pending, (state, action) => {
                state.shippingAddressesStatus = 'loading';
            })
            .addCase(getShippingAddresses.fulfilled, (state, action) => {
                state.shippingAddressesStatus = 'success';
                if ('detail' in action.payload) {
                    state.addresses = [];
                } else {
                    state.addresses = action.payload;
                }
            })
            .addCase(getShippingAddresses.rejected, (state, action) => {
                state.shippingAddressesStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(getShippingAddressAsTrue.pending, (state, action) => {
                state.addressAsTrueStatus = 'loading';
            })
            .addCase(getShippingAddressAsTrue.fulfilled, (state, action) => {
                state.addressAsTrueStatus = 'success';
                if ('detail' in action.payload) {
                    state.addressObject = addressObject;
                } else {
                    const {
                        first_name: firstName, last_name: lastName,
                        address1: streetAddress, address2: apartment,
                        postal_code: postalCode, city, province,
                        phone_number: phoneNumber, phone_code: phoneCode,
                        email, as_primary: asPrimary
                    } = action.payload;
                    state.addressObject = {
                        ...state.addressObject,
                        firstName,
                        lastName,
                        streetAddress,
                        apartment,
                        postalCode,
                        city,
                        province,
                        phoneCode,
                        phoneNumber,
                        email,
                        asPrimary,
                    };
                }
            })
            .addCase(getShippingAddressAsTrue.rejected, (state, action) => {
                state.addressAsTrueStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(getAddressDetail.pending, (state, action) => {
                state.addressDetailStatus = 'loading';
            })
            .addCase(getAddressDetail.fulfilled, (state, action) => {
                state.addressDetailStatus = 'success';
                const {
                    first_name: firstName, last_name: lastName,
                    address1: streetAddress, address2: apartment,
                    postal_code: postalCode, city, province,
                    phone_number: phoneNumber, phone_code: phoneCode,
                    email, as_primary: asPrimary
                } = action.payload;
                state.addressObject = {
                    ...state.addressObject,
                    firstName,
                    lastName,
                    streetAddress,
                    apartment,
                    postalCode,
                    city,
                    province,
                    phoneCode,
                    phoneNumber,
                    email,
                    asPrimary,
                };
            })
            .addCase(getAddressDetail.rejected, (state, action) => {
                state.addressDetailStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(getCountries.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getCountries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.countries = action.payload;
            })
            .addCase(getCountries.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })

            .addCase(getProvinces.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getProvinces.fulfilled, (state, action) => {
                state.isLoading = false;
                state.provinces = action.payload;
            })
            .addCase(getProvinces.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })

            .addCase(getPhoneCodes.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getPhoneCodes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.phoneCodes = action.payload;
            })
            .addCase(getPhoneCodes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })
    }
});

export const {
    setIsLoading,
    setError,
    setProvince,
    setPhoneCode,
    setProvincesFiltered,
    setPhoneCodesFiltered,
    editAddress
} = addressFormSlice.actions;
export default addressFormSlice.reducer;