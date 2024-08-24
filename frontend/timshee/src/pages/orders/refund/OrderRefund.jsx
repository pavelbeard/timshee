import React from "react";
import {useLocation, useParams} from "react-router-dom";
import Loading from "../../Loading";
import Error from "../../Error";

import RefundForm from "../../../components/orders/refund/forms/RefundForm";
import {useQuery} from "react-query";
import {privateApi} from "../../../lib/api";
import Nothing from "../../Nothing";
import {useSearchParameters} from "../../../lib/hooks";
import {useGetOrderQuery} from "../../../redux/features/api/orderApiSlice";

const OrderRefund = () => {
    const { orderId } = useParams();
    const { get } = useSearchParameters();
    const stockItemId = get('item_id') || 0;
    const stockItemQuantity = get('item_q') || 0;
    const { isLoading, data: order, error } = useGetOrderQuery(orderId);

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