import {apiSlice} from "../../services/app/api/apiSlice";
import {orderTags} from "./tags";

const tags = orderTags;

const _apiSliceWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: [
        ...Object.values(tags)
    ]
});

export const orderApiSlice = _apiSliceWithTags.injectEndpoints({
    endpoints: builder => ({
        getOrder: builder.query({
            query: (orderId) => ({
                url: `/order/orders/${orderId}/`,
                method: 'GET',
            }),
            providesTags: [tags.UPDATE_ORDER, tags.GET_ORDER]
        }),
        updateOrder: builder.mutation({
            query: (args) => {
                const { orderId, data } = args;
                return {
                    url: `/order/orders/${orderId}/update_shipping_info/`,
                    method: 'PATCH',
                    body: { shipping_data: data }
                }
            },
            invalidatesTags: [tags.UPDATE_ORDER]
        }),
    })
});

export const {
    useGetOrderQuery,
    useUpdateOrderMutation,
} = orderApiSlice;