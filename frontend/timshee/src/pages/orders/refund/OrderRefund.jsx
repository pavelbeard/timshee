import React from "react";
import {useLocation, useParams} from "react-router-dom";
import Loading from "../../Loading";
import Error from "../../Error";

import RefundForm from "../../../components/orders/refund/forms/RefundForm";
import {useQuery} from "react-query";
import {privateApi} from "../../../lib/api";
import Nothing from "../../Nothing";

const OrderRefund = () => {
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = params.orderId;
    const stockItemId = queryParams.get('item_id') || 0;
    const stockItemQuantity = queryParams.get('item_q') || 0;
    const { isLoading, data: order, error } = useQuery({
        queryKey: ['order.detail'],
        queryFn: async ({ signal }) => {
            try {
                const order = await privateApi.get(`/api/order/orders/${orderId}/`, { signal });
                return order.data;
            } catch (error) {
                return null;
            }
        }
    });

    if (isLoading) {
        return <Loading />;
    } else if (error) {
        return <Error />;
    } else if (order){
        return (
            <RefundForm
                stockId={stockItemId}
                stockQuantity={stockItemQuantity}
            />
        )
    } else {
        return <Nothing />
    }
};

export default OrderRefund;