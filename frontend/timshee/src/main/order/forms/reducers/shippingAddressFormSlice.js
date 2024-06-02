import {createSlice} from "@reduxjs/toolkit";
import {getShippingAddressAsTrue, getShippingAddresses, getUsernameEmail} from "./asyncThunks";



const initialState = {
    // general values
    isLoading: false,
    errorMessage: "",
    // light objects
    usernameEmail: "",
    usernameEmailStatus: 'idle',

    shippingAddressString: "",
    // form objects
    addressId: 0,
    addressObjectStatus: 'idle',
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
    shippingAddressesStatus: 'idle',
    //
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
        setShippingAddress: (state, action) => {
            state.shippingAddressString = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setAddressId: (state, action) => {
            state.addressId = action.payload;
        },
        setProvince: (state, action) => {
            console.log(action.payload)
            state.addressObject = {
                ...state.addressObject,
                province: action.payload,
            };
        },
        setPhoneCode: (state, action) => {
            const phoneCode = action.payload;
            state.addressObject = {
                ...state.addressObject,
                phoneCode: action.payload,
            }
        },
        setAddressObject: (state, action) => {
            const data = action.payload;
            console.log(action.payload)
            state.addressObject = {...state.addressObject, ...data};
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
                state.shippingAddressesStatus = 'loading';
            })
            .addCase(getShippingAddresses.fulfilled, (state, action) => {
                state.shippingAddressesStatus = 'success';
                if ('detail' in action.payload) {
                    state.shippingAddresses = [];
                } else {
                    state.shippingAddresses = action.payload.map(address => rewriteShippingAddressObject(address));
                }
            })
            .addCase(getShippingAddresses.rejected, (state, action) => {
                state.shippingAddressesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getShippingAddressAsTrue.pending, (state, action) => {
                state.addressObjectStatus = 'idle';
            })
            .addCase(getShippingAddressAsTrue.fulfilled, (state, action) => {
                state.addressObjectStatus = 'success';
                state.addressObject = rewriteShippingAddressObject(action.payload);
            })
            .addCase(getShippingAddressAsTrue.rejected, (state, action) => {
                state.addressObjectStatus = 'error';
                state.errorMessage = action.payload;
            })

            .addCase(getUsernameEmail.pending, (state, action) => {
                state.usernameEmailStatus = 'loading';
            })
            .addCase(getUsernameEmail.fulfilled, (state, action) => {
                state.usernameEmailStatus = 'success';
                state.usernameEmail = action.payload;
            })
            .addCase(getUsernameEmail.rejected, (state, action) => {
                state.usernameEmailStatus = 'error';
                state.error = action.payload;
            })
    }
});

export const {
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