import React, {useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getOrderDetail} from "./forms/reducers/asyncThunks";
import AuthService from "../api/authService";
import Loading from "../Loading";
import Error from "../Error";

import "./Orders.css";
import RefundForm from "./forms/RefundForm";

const OrderRefund = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const token = AuthService.getCurrentUser();
    const {order, orderDetailStatus} = useSelector(state => state.ordersPage);

    useEffect(() => {
        if (orderDetailStatus === 'idle') {
            dispatch(getOrderDetail({orderId: params.orderId, token}));
        }
    }, []);

    if (orderDetailStatus === 'success') {
        return (
            <div className="order-refund-container">
                <RefundForm orderNumber={order.orderNumber}
                            stockId={parseInt(params.stockItemId)}
                            stockQuantity={parseInt(params.stockItemQuantity)} />
            </div>
        )
    } else if (orderDetailStatus === 'loading') {
        return <Loading />;
    } else if (orderDetailStatus === 'error') {
        return <Error />;
    }
};

export default OrderRefund;