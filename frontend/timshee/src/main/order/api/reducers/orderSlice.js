import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAddress, createOrder, updateAddress, updateOrder} from "../../../../redux/slices/shopSlices/checkout";
import AuthService from "../../../api/authService";
import {
    deleteOrder,
    getCountries, getOrderDetail,
    getPhoneCodes,
    getProvinces,
    getShippingMethodDetail,
    getShippingMethods, updateOrderShippingMethod
} from "../asyncThunks";

const token = AuthService.getCurrentUser();

const initialState = {
    orderData: {
        order: undefined,
        orders: [],
    },
    orderHasDeleted: false,
    // orderDetail
    order: undefined,
    orderStatus: 'idle',
    // ordersAll
    orders: [],
    orderId: 0,
    steps: [
        {value: 1, step: "information"},
        {value: 2, step: "shipping"},
        {value: 3, step: "payment"},
    ],
    step: undefined,

    shippingMethodData: {
        shippingMethods: [],
        shippingMethod: undefined,
    },
    // addressDetail
    address: undefined,
    addressStatus: 'idle',
    // addressesAll
    addresses: [],
    addressesStatus: 'idle',
    // countriesAll
    countries: [],
    countriesStatus: 'idle',
    // provincesAll
    provinces: [],
    provincesStatus: 'idle',
    // phoneCodesAll
    phoneCodes: [],
    phoneCodesStatus: 'idle',
    // shippingMethod
    shippingMethod: undefined,
    shippingMethodStatus: 'idle',
    // shippingMethodsAll
    shippingMethods: [],
    shippingMethodsStatus: 'idle',

    isLoading: false,
    error: null,
}

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrderId: (state, action) => {
            state.orderId = action.payload;
        },
        resetOrderId: (state) => {
            state.orderId = undefined;
        },
        setStep(state, action) {
            localStorage.setItem("step", JSON.stringify(action.payload));
            state.step = action.payload;
        }
    },
    extraReducers: (builder) => {
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

            .addCase(getOrderDetail.pending, (state, action) => {
                state.orderStatus = 'loading';
            })
            .addCase(getOrderDetail.fulfilled, (state, action) => {
                state.orderStatus = 'success';
                state.order = action.payload;
            })
            .addCase(getOrderDetail.rejected, (state, action) => {
                state.orderStatus = 'error';
                state.error = action.payload;
            })

            .addCase(updateOrderShippingMethod.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updateOrderShippingMethod.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = action.payload;
            })
            .addCase(updateOrderShippingMethod.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.order = undefined;
            })
    }
});

export const {
    setOrderId,
    resetOrderId,
    setStep,
} = orderSlice.actions;
export default orderSlice.reducer;



