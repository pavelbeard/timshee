import {createSlice, current} from "@reduxjs/toolkit";
import {createOrUpdateAddress, getShippingAddressAsTrue, getShippingAddresses, getUsernameEmail} from "./asyncThunks";
import {
    getCountries, getFilteredPhoneCodes, getFilteredProvinces, getOrderDetail,
    getPhoneCodes,
    getProvinces,
    getShippingMethodDetail,
    getShippingMethods, updateOrderShippingMethod, updateOrderStatus
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
    filteredPhoneCodesStatus: 'idle',


    // order
    order: undefined,
    orderStatus: 'idle',
    updateOrderShippingMethodStatus: 'idle',
    updateOrderStatusStatus: 'idle',

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
        setAddressFormObject: (state, action) => {
            state.addressFormObject = action.payload;
        },
        setAddressObject: (state, action) => {
            const data = action.payload;
            if (data.province || data.phone_code) {
                const provincesCopy = [...current(state).provinces];
                const phoneCodesCopy = [...current(state).phoneCodes];
                state.provincesInternal = provincesCopy.filter(p =>
                    p.country.id === data.province.country.id
                );
                state.phoneCodesInternal = phoneCodesCopy.filter(p =>
                    p.country === data.phone_code.country
                );
            }
            state.addressFormObjectObject = {...state.addressFormObject, data};
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
        setShippingMethod: (state, action) => {
            const shippingMethodsCopy = [...current(state).shippingMethods];
            const newShippingMethods = shippingMethodsCopy.map(m =>
                m.id === action.payload ? {...m, checked: true} : {...m, checked: false}
            );
            state.shippingMethods = newShippingMethods;
        }
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
                state.filteredProvinces = action.payload.filter(p =>
                    p?.country?.id === [...current(state).countries][0]?.id
                );
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
                if (!Array.isArray(action.payload)) {
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
                if (action.payload?.detail === undefined) {
                    state.addressFormObject = action.payload;
                }
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

            .addCase(getOrderDetail.pending, (state, action) => {
                state.orderStatus = 'loading';
            })
            .addCase(getOrderDetail.fulfilled, (state, action) => {
                state.orderStatus = 'success';

                if (action.payload?.shipping_address?.id !== undefined) {
                    state.addressFormObject = action.payload.shipping_address;
                }

                if (action.payload?.shipping_method?.name !== "") {
                    const shippingMethodsCopy = [...current(state).shippingMethods];
                    state.shippingMethods = shippingMethodsCopy.map(m =>
                        m.id === action.payload.shipping_method.id
                            ? {...m, checked: true} : {...m, checked: false}
                    );
                }

                state.order = action.payload;
            })
            .addCase(getOrderDetail.rejected, (state, action) => {
                state.orderStatus = 'error';
                state.error = action.payload;
            })

            .addCase(updateOrderShippingMethod.pending, (state, action) => {
                state.updateOrderShippingMethodStatus = 'loading';
            })
            .addCase(updateOrderShippingMethod.fulfilled, (state, action) => {
                state.updateOrderShippingMethodStatus = 'success';

                if (action.payload?.shipping_address !== undefined &&
                    action.payload?.shipping_method !== undefined) {
                    const order = action.payload;
                    const newOrder = {
                        ...order,
                        shipping_address: [...current(state).shippingAddresses].find(a =>
                            a.id === order.shipping_address
                        ),
                        shipping_method: [...current(state).shippingMethods].find(sm =>
                            sm.id === order.shipping_method
                        )
                    }
                    state.order = newOrder;
                }
            })
            .addCase(updateOrderShippingMethod.rejected, (state, action) => {
                state.updateOrderShippingMethodStatus = 'error';
                state.error = action.payload;
            })

            .addCase(updateOrderStatus.pending, (state, action) => {
                state.updateOrderStatusStatus = 'loading';
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.updateOrderStatusStatus = 'success';
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.updateOrderStatusStatus = 'error';
                state.error = action.payload;
            })

            .addCase(createOrUpdateAddress.pending, (state, action) => {
                state.createOrUpdateAddressStatus = 'loading';
            })
            .addCase(createOrUpdateAddress.fulfilled, (state, action) => {
                state.createOrUpdateAddressStatus = 'success';
                const address = action.payload;
                const newAddress = {
                    ...address,
                    province: [...current(state).provinces].find(p => p.id === address.province),
                    phone_code: [...current(state).phoneCodes].find(p => p.country === address.phone_code),
                }
                state.order.shipping_address = newAddress;
            })
            .addCase(createOrUpdateAddress.rejected, (state, action) => {
                state.createOrUpdateAddressStatus = 'error';
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
    setShippingMethod,
} = shippingAddressFormSlice.actions;
export default shippingAddressFormSlice.reducer;