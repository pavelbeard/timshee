import {createSlice} from "@reduxjs/toolkit";
import {getShippingAddressAsTrue, getShippingAddresses} from "./asyncThunks";



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
        phone: "",
        email: "",
    },
    // heavy objects
    shippingAddresses: [],
    provincesInternal: [],
    phoneCodesInternal: [],
};

const rewriteShippingAddressObject = (address) => {
    const {
        id, first_name: firstName, last_name: lastName,
        address1: streetAddress, address2: apartment,
        postal_code: postalCode, city, province,
        phone_number: phoneNumber, phone_code: phoneCode,
        email,
    } = address;
    return {
        id,
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
            state.addressObject = action.payload;
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
            .addCase(getShippingAddresses.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getShippingAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.shippingAddresses = action.payload.map(address => rewriteShippingAddressObject(address));
            })
            .addCase(getShippingAddresses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(getShippingAddressAsTrue.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getShippingAddressAsTrue.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressObject = rewriteShippingAddressObject(action.payload);
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