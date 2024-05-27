import {createSlice} from "@reduxjs/toolkit";
import {getShippingAddressAsTrue} from "./asyncThunks";

const initialState = {
    // general values
    isLoading: false,
    errorMessage: "",
    // light objects
    usernameEmail: "",
    shippingAddress: "",
    // form objects
    addressId: 0,
    addressObject: {
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
        phone: "",
        email: "",
    },
    // heavy objects
    shippingAddresses: [],
    provincesInternal: [],
    phoneCodesInternal: [],
};

export const shippingAddressFormSlice = createSlice({
    name: "shippingAddressForm",
    initialState,
    reducers: {
        setUsernameEmail: (state, action) => {
            state.usernameEmail = action.payload;
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setAddressId: (state, action) => {
            state.addressId = action.payload;
        },
        setProvince: (state, action) => {
            state.addressObject = {
                ...state.addressObject,
                province: action.payload,
            };
        },
        setPhoneCode: (state, action) => {
            state.addressObject = {
                ...state.addressObject,
                phoneCode: action.payload,
            }
        },
        setAddressObject: (state, action) => {
            const {
                first_name: firstName, last_name: lastName,
                address1: streetAddress, address2: apartment,
                postal_code: postalCode, city, province,
                phone_number: phoneNumber, phone_code: phoneCode,
                email,
            } = action.payload;
            const prevState = {...state.addressFormObject};
            state.addressFormObject = {
                ...prevState,
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
            };
        },
        setShippingAddresses: (state, action) => {
            state.shippingAddresses = action.payload;
        },
        setProvincesFiltered: (state, action) => {
            state.provincesInternal = action.payload;
        },
        setPhoneCodesFiltered: (state, action) => {
            state.phoneCodesInternal = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getShippingAddressAsTrue.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getShippingAddressAsTrue.fulfilled, (state, action) => {
                state.isLoading = false;
                const {
                    first_name: firstName, last_name: lastName,
                    address1: streetAddress, address2: apartment,
                    postal_code: postalCode, city, province,
                    phone_number: phoneNumber, phone_code: phoneCode,
                    email,
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
                };
            })
            .addCase(getShippingAddressAsTrue.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload;
                state.addressObject = {}
            });
    }
});

export const {
    setUsernameEmail,
    setShippingAddress,
    setErrorMessage,
    setAddressId,
    setAddressObject,
    setShippingAddresses,
    setProvincesFiltered,
    setPhoneCodesFiltered,
    setProvince,
    setPhoneCode,
} = shippingAddressFormSlice.actions;
export default shippingAddressFormSlice.reducer;