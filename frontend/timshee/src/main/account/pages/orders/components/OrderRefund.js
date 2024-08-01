import React, {useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getOrderDetail} from "../../forms/reducers/asyncThunks";
import AuthService from "../../../../api/authService";
import Loading from "../../../../techPages/Loading";
import Error from "../../../../techPages/Error";

import "../Orders.css";
import RefundForm from "../forms/RefundForm";
import {selectCurrentToken} from "../../../../../redux/services/features/auth/authSlice";

const OrderRefund = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const stockItemId = params.stockItemId ? parseInt(params.stockItemId) : 0;
    const stockItemQuantity = params.stockItemId ? parseInt(params.stockItemQuantity) : 0;
    const token = useSelector(selectCurrentToken);
    const {order, orderDetailStatus} = useSelector(state => state.ordersPage);

    useEffect(() => {
        if (orderDetailStatus === 'idle') {
            dispatch(getOrderDetail({orderId: params.orderId, token}));
        }
    }, []);

    if (orderDetailStatus === 'success') {
        return (
            <div className="order-refund-container">
                <RefundForm orderId={order.second_id}
                            stockId={stockItemId}
                            stockQuantity={stockItemQuantity} />
            </div>
        )
    } else if (orderDetailStatus === 'loading') {
        return <Loading />;
    } else if (orderDetailStatus === 'error') {
        return <Error />;
    }
};

export default OrderRefund;