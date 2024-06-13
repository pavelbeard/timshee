import {createSlice} from "@reduxjs/toolkit";
import {getLastOrder, getOrderDetail, getOrders, refundPartial, refundWhole} from "./asyncThunks";
import orders from "../../Orders";

const initialState = {
    // general values
    isLoading: false,
    isError: false,
    // heavy values
    lastOrderStatus: 'idle',
    order: undefined,
    orderDetailStatus: 'idle',
    orders: [],
    ordersStatus: 'idle',
    orderRefundWholeStatus: 'idle',
    orderRefundPartialStatus: 'idle',
};

const ordersSlice = createSlice({
    name: "ordersPage",
    initialState,
    reducers: {
        resetRefundStatus: (state, action) => {
            state.orderRefundWholeStatus = 'idle';
            state.orderRefundPartialStatus = 'idle';
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getOrders.pending, (state, action) => {
                state.ordersStatus = 'loading';
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.ordersStatus = 'success';
                if ('detail' in action.payload) {
                    state.orders = [];
                } else {
                    state.orders = action.payload;
                }
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.ordersStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(getOrderDetail.pending, (state, action) => {
                state.orderDetailStatus = 'loading';
            })
            .addCase(getOrderDetail.fulfilled, (state, action) => {
                state.orderDetailStatus = 'success';
                if (action.payload?.detail === undefined) {
                    state.order = action.payload;
                }
            })
            .addCase(getOrderDetail.rejected, (state, action) => {
                state.orderDetailStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(getLastOrder.pending, (state, action) => {
                state.lastOrderStatus = 'loading';
            })
            .addCase(getLastOrder.fulfilled, (state, action) => {
                state.lastOrderStatus = 'success';
                state.order = action.payload;
            })
            .addCase(getLastOrder.rejected, (state, action) => {
                state.lastOrderStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(refundWhole.pending, (state, action) => {
                state.orderRefundWholeStatus = 'loading';
            })
            .addCase(refundWhole.fulfilled, (state, action) => {
                state.orderRefundWholeStatus = 'success';
                state.order = action.payload;
            })
            .addCase(refundWhole.rejected, (state, action) => {
                state.orderRefundWholeStatus = 'error';
                state.isError = action.payload;
            })

            .addCase(refundPartial.pending, (state, action) => {
                state.orderRefundPartialStatus = 'loading';
            })
            .addCase(refundPartial.fulfilled, (state, action) => {
                state.orderRefundPartialStatus = 'success';
                state.order = action.payload;
            })
            .addCase(refundPartial.rejected, (state, action) => {
                state.orderRefundPartialStatus = 'error';
                state.isError = action.payload;
            })
    }
});

export const {
    resetRefundStatus,
} = ordersSlice.actions;
export default ordersSlice.reducer;