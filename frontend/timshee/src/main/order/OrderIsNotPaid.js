import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import "./OrderStatus.css";
import {changeQuantity, deleteCartItems, getCollections} from "../../redux/slices/shopSlices/itemSlice";
import {useDispatch, useSelector} from "react-redux";
import {updateOrderStatus} from "../../redux/slices/shopSlices/orderSlice";

const OrderIsNotPaid = () => {
    const params = useParams();
    const navigate = useNavigate();

    const orderId = params.orderId;
    const orderNumber = params.orderNumber;

    return(
        <div className="order-status">
            <div className="order-paid">
                <h1>PAYMENT FOR ORDER {orderNumber} HASN'T PASSED. Please try it again</h1>
            </div>
            <div className="back-to-main" onClick={() =>
                navigate(`/shop/${orderId}/checkout/payment/`)}>BACK TO CHECKOUT</div>
        </div>

    )
};

export default OrderIsNotPaid;