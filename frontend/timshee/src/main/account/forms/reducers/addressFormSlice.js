import {createSlice, current} from "@reduxjs/toolkit";
import {
    createAddress, deleteAddress,
    getAddressAsTrue,
    getAddressDetail,
    getAddresses,
    getCountries,
    getPhoneCodes,
    getProvinces,
    updateAddress
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
    hasCreated: 0,
    hasUpdated: 0,
    hasDeleted: 0,
    // light values
    // heavy values
    addressObject,
    addressDetailStatus: 'idle',
    addressAsTrueStatus: 'idle',
    addressCreationStatus: 'idle',
    addressUpdatingStatus: 'idle',
    addressDeletingStatus: 'idle',
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
            .addCase(getAddresses.pending, (state, action) => {
                state.shippingAddressesStatus = 'loading';
            })
            .addCase(getAddresses.fulfilled, (state, action) => {
                state.shippingAddressesStatus = 'success';
                if (!Array.isArray(action.payload)) {
                    state.addresses = [];
                } else {
                    state.addresses = action.payload;
                }
            })
            .addCase(getAddresses.rejected, (state, action) => {
                state.shippingAddressesStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(getAddressAsTrue.pending, (state, action) => {
                state.addressAsTrueStatus = 'loading';
            })
            .addCase(getAddressAsTrue.fulfilled, (state, action) => {
                state.addressAsTrueStatus = 'success';
                if (action.payload?.detail === undefined) {
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
            .addCase(getAddressAsTrue.rejected, (state, action) => {
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

            .addCase(createAddress.pending, (state, action) => {
                state.addressCreationStatus = 'loading';
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.addressCreationStatus = 'success';
                const newAddress = action.payload
                const addressesCopy = [...current(state).addresses];
                const provincesCopy = [...current(state).provinces];
                const phoneCodesCopy = [...current(state).phoneCodes];
                newAddress['province'] = provincesCopy.find(p =>
                    p.id === newAddress.province
                );
                newAddress['phone_code'] = phoneCodesCopy.find(pc =>
                    pc.country === newAddress.phone_code
                );
                addressesCopy.push(newAddress);
                state.addresses = addressesCopy;
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.addressCreationStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(updateAddress.pending, (state, action) => {
                state.addressUpdatingStatus = 'loading';
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.addressUpdatingStatus = 'success';
                const newAddress = action.payload;
                const addressesCopy = [...current(state).addresses];
                const provincesCopy = [...current(state).provinces];
                const phoneCodesCopy = [...current(state).phoneCodes];
                newAddress['province'] = provincesCopy.find(p =>
                    p.id === newAddress.province
                );
                newAddress['phone_code'] = phoneCodesCopy.find(pc =>
                    pc.country === newAddress.phone_code
                );
                const newState = [...addressesCopy.filter(a =>
                    a.id !== newAddress.id
                ), newAddress];
                state.addresses = newState.toSorted((a, b) => a.id - b.id);
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.addressUpdatingStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(deleteAddress.pending, (state) => {
                state.addressDeletingStatus = 'loading';
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addressDeletingStatus = 'success';
                const idForDelete = action.payload;
                const addressesCopy = [...current(state).addresses];

                state.addresses = addressesCopy.filter(a => a.id !== idForDelete);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.addressDeletingStatus = 'error';
                state.error = action.payload;
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