import {apiSlice} from "../../services/app/api/apiSlice";
import {cartTags, orderTags, paymentTags} from "./tags";

const tags = { ...cartTags, ...paymentTags, ...orderTags };
export const paymentStatusDict = {
    succeeded: "succeeded",
    waiting_for_capture: "waiting_for_capture",
    pending: "pending",
    cancelled: "cancelled"
}

const _apiSliceWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: [
        ...Object.values(tags)
    ]
});

export const paymentApiSlice = _apiSliceWithTags.injectEndpoints({
    endpoints: builder => ({
        createPayment: builder.mutation({
            query: (data) => ({
                url: '/payment/payment-manage/create_payment/',
                method: 'POST',
                body: {...data}
            })
        }),
        updatePayment: builder.query({
            query: ({orderId, data}) => ({
                url: `/payment/payment-manage/${orderId}/update_payment/`,
                method: 'PUT',
                body: { payment_status: data }
            }),
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue?.status;
            },
            invalidatesTags: (result, error, arg) => {
                console.log(result)
                if (result.status === paymentStatusDict.succeeded) {
                    return [tags.REMOVE_ALL_CART]
                }
            }
        }),
        getStatus: builder.query({
            query: (orderId) => ({
                url: `/payment/payment-manage/${orderId}/get_status/`,
                method: 'GET'
            }),
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue?.status;
            }
        }),
        refundWhole: builder.mutation({
            query: ({orderId, data}) => ({
                url: `/payment/payment-manage/${orderId}/refund_whole_order/`,
                method: 'PUT',
                body: {...data}
            }),
            invalidatesTags: [tags.GET_ORDER]
            // invalidatesTags: (result, error, arg, meta) => [{ type: 'ORDER', id: result.orderId }]
        }),
        refundPartial: builder.mutation({
            query: ({orderId, data}) => ({
                url: `/payment/payment-manage/${orderId}/refund_partial/`,
                method: 'PUT',
                body: {...data}
            }),
            invalidatesTags: [tags.GET_ORDER]
            // invalidatesTags: (result, error, arg, meta) => [{ type: 'ORDER', id: result.orderId }]
        })
    }),

});

export const {
    useCreatePaymentMutation,
    useUpdatePaymentQuery,
    useRefundWholeMutation,
    useRefundPartialMutation,
    useGetStatusQuery,
} = paymentApiSlice;