import {createSlice, current} from "@reduxjs/toolkit";

const initialState = {
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
        },
    },
    extraReducers: (builder) => {

    }
});

export const {
    setOrderId,
    resetOrderId,
    setStep,
} = orderSlice.actions;
export default orderSlice.reducer;



