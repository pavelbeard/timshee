import {createSlice} from "@reduxjs/toolkit";
import {getLastOrder, getOrderDetail, getOrders} from "./asyncThunks";
import orders from "../../Orders";

const initialState = {
    // general values
    isLoading: false,
    isError: false,
    // heavy values
    order: {
        id: 0,
        shippingAddress: {
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
                phoneCode: ""
            },
            phoneNumber: "",
            additionalData: "",
        },
        shippingMethod: {
            id: 0,
            shippingName: "",
            price: 0.00
        },
        orderNumber: "",
        orderedItems: {
            data: [],
            totalPrice: "",
        },
        status: "",
        createdAt: "",
        updatedAt: "",
    },
    orders: [],
};

const orderDetailEqualizer = (order) => {
    return {
        id: order.id,
        shippingAddress: {
            id: order.shipping_address.id,
            firstName: order.shipping_address.first_name,
            lastName: order.shipping_address.last_name,
            streetAddress: order.shipping_address.address1,
            apartment: order.shipping_address.address2,
            postalCode: order.shipping_address.postal_code,
            city: order.shipping_address.city,
            province: {
                id: order.shipping_address.province.id,
                name: order.shipping_address.province.name,
                country: {
                    id: order.shipping_address.province.country.id,
                    name: order.shipping_address.province.country.name,
                }
            },
            phoneCode: {
                country: order.shipping_address.phone_code.country,
                phoneCode: order.shipping_address.phone_code.phone_code
            },
            phoneNumber: order.shipping_address.phone_number,
            additionalData: order.shipping_address.additional_data,
        },
        shippingMethod: {
            id: order.shipping_method.id,
            shippingName: order.shipping_method.shipping_name,
            price: order.shipping_method.price,
        },
        orderNumber: order.order_number,
        orderedItems: {
            data: order.ordered_items.data,
            totalPrice: order.ordered_items.total_price,
        },
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
    }
};

const ordersSlice = createSlice({
    name: "ordersPage",
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(getOrders.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.map(order => orderDetailEqualizer(order));
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })

            .addCase(getOrderDetail.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = orderDetailEqualizer(action.payload);
            })
            .addCase(getOrderDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })

            .addCase(getLastOrder.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getLastOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = orderDetailEqualizer(action.payload);
            })
            .addCase(getLastOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })
    }
});

export const {

} = ordersSlice.actions;
export default ordersSlice.reducer;