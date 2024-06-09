import {createSlice, current} from "@reduxjs/toolkit";
import {getShippingAddressAsTrue, getShippingAddresses, getUsernameEmail} from "./asyncThunks";
import {
    getCountries, getFilteredPhoneCodes, getFilteredProvinces,
    getPhoneCodes,
    getProvinces,
    getShippingMethodDetail,
    getShippingMethods
} from "../../api/asyncThunks";



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
    addressFormObject: undefined,
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

    shippingMethod: undefined,
    shippingMethodStatus: 'idle',

    shippingMethods: [],
    shippingMethodsStatus: 'idle',

    countries: [],
    countriesStatus: 'idle',
    provinces: [],
    provincesStatus: 'idle',
    filteredProvinces: [],
    filteredProvincesStatus: 'idle',
    phoneCodes: [],
    phoneCodesStatus: 'idle',
    filteredPhoneCodes: [],
    filteredPhoneCodesStatus: 'idle'
};

const rewriteShippingMethodObject = (shippingMethod) => {
    return {
        id: shippingMethod.id,
        shippingName: shippingMethod.shipping_name,
        price: shippingMethod.price,
    }
};

const rewriteShippingAddressObject = (address) => {
    const {
        id, first_name: firstName, last_name: lastName,
        address1: streetAddress, address2: apartment,
        postal_code: postalCode, city, province,
        phone_number: phoneNumber, phone_code: {
            phone_code: phoneCode,
            country: country,
        },
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
        phoneCode: {
            phoneCode,
            country,
        },
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
        setAddressFormObject: (state, action) => {
            state.addressFormObject = action.payload;
        },
        setAddressObject: (state, action) => {
            const data = action.payload;
            if (data.province || data.phoneCode) {
                const provincesCopy = [...current(state).provinces];
                const phoneCodesCopy = [...current(state).phoneCodes];
                state.provincesInternal = provincesCopy.filter(p =>
                    p.country.id === data.province.country.id
                );
                state.phoneCodesInternal = phoneCodesCopy.filter(p =>
                    p.country === data.phoneCode.country
                );
            }
            state.addressObject = {...state.addressObject, ...data};
        },
        resetAddressObject: (state, action) => {
            const resetState = {
                ...initialState.addressObject,
                phoneCode: {
                    phoneCode: [...current(state).phoneCodes][0].phone_code,
                    country: [...current(state).phoneCodes][0].country,
                },
                province: [...current(state).provinces][0],
            }
            state.addressObject = resetState;
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
            .addCase(getCountries.pending, (state, action) => {
                state.countriesStatus = 'loading';
            })
            .addCase(getCountries.fulfilled, (state, action) => {
                state.countriesStatus = 'success';
                state.countries = action.payload;
            })
            .addCase(getCountries.rejected, (state, action) => {
                state.countriesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getFilteredProvinces.pending, (state, action) => {
                state.filteredProvincesStatus = 'loading';
            })
            .addCase(getFilteredProvinces.fulfilled, (state, action) => {
                state.filteredProvincesStatus = 'success';
                state.filteredProvinces = action.payload;
            })
            .addCase(getFilteredProvinces.rejected, (state, action) => {
                state.filteredProvincesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getProvinces.pending, (state, action) => {
                state.provincesStatus = 'loading';
            })
            .addCase(getProvinces.fulfilled, (state, action) => {
                state.provincesStatus = 'success';
                state.provinces = action.payload;
            })
            .addCase(getProvinces.rejected, (state, action) => {
                state.provincesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getFilteredPhoneCodes.pending, (state, action) => {
                state.filteredPhoneCodesStatus = 'loading';
            })
            .addCase(getFilteredPhoneCodes.fulfilled, (state, action) => {
                state.filteredPhoneCodesStatus = 'success';
                state.filteredPhoneCodes = action.payload;
            })
            .addCase(getFilteredPhoneCodes.rejected, (state, action) => {
                state.filteredPhoneCodesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getPhoneCodes.pending, (state, action) => {
                state.phoneCodesStatus = 'loading';
            })
            .addCase(getPhoneCodes.fulfilled, (state, action) => {
                state.phoneCodesStatus = 'success';
                state.phoneCodes = action.payload;
            })
            .addCase(getPhoneCodes.rejected, (state, action) => {
                state.phoneCodesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getShippingMethods.pending, (state, action) => {
                state.shippingMethodsStatus = 'loading';
            })
            .addCase(getShippingMethods.fulfilled, (state, action) => {
                state.shippingMethodsStatus = 'success';
                state.shippingMethods = action.payload;
            })
            .addCase(getShippingMethods.rejected, (state, action) => {
                state.shippingMethodsStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getShippingMethodDetail.pending, (state, action) => {
                state.shippingMethodStatus = 'loading';
            })
            .addCase(getShippingMethodDetail.fulfilled, (state, action) => {
                state.shippingMethodStatus = 'success';
                state.shippingMethod = action.payload;
            })
            .addCase(getShippingMethodDetail.rejected, (state, action) => {
                state.shippingMethodStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getShippingAddresses.pending, (state, action) => {
                state.shippingAddressesStatus = 'loading';
            })
            .addCase(getShippingAddresses.fulfilled, (state, action) => {
                state.shippingAddressesStatus = 'success';
                if ('detail' in action.payload) {
                    state.shippingAddresses = [];
                } else {
                    state.shippingAddresses = action.payload;
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
                state.addressFormObject = action.payload;
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
    setAddressFormObject,
    resetAddressObject,
    setShippingAddresses,
    setProvincesFiltered,
    setPhoneCodesFiltered,
    setProvince,
    setPhoneCode,
} = shippingAddressFormSlice.actions;
export default shippingAddressFormSlice.reducer;