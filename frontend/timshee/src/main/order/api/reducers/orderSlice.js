import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAddress, createOrder, updateAddress, updateOrder} from "../../../../redux/slices/shopSlices/checkout";
import AuthService from "../../../api/authService";
import {
    deleteOrder,
    getCountries, getOrderDetail,
    getPhoneCodes,
    getProvinces,
    getShippingMethodDetail,
    getShippingMethods, updateOrderShippingMethod, updateOrderStatus
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

    updateOrderShippingMethodStatus: 'idle',
    updateOrderStatusStatus: 'idle',

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
                state.updateOrderShippingMethodStatus = 'loading';
            })
            .addCase(updateOrderShippingMethod.fulfilled, (state, action) => {
                state.updateOrderShippingMethodStatus = 'success';
                state.order = action.payload;
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
    }
});

export const {
    setOrderId,
    resetOrderId,
    setStep,
} = orderSlice.actions;
export default orderSlice.reducer;



