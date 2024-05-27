import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import "./OrderStatus.css";
import {changeQuantity, deleteCartItems, getCollections} from "../../redux/slices/shopSlices/itemSlice";
import {useDispatch, useSelector} from "react-redux";
import {updateOrderStatus} from "../../redux/slices/shopSlices/orderSlice";

const OrderPaid = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();

    const orderId = params.orderId;
    const orderNumber = params.orderNumber;

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        if (orderId !== undefined) {
            dispatch(updateOrderStatus({
                orderId: orderId,
                isAuthenticated: isAuthenticated,
                status: "processing",
            }));
            dispatch(deleteCartItems({
                hasOrdered: true
            }));
        }
    }, []);

    return(
        <div className="order-status">
            <div className="order-paid">
                <h1>ORDER {orderNumber} HAS BEEN PAID SUCCESSFULLY!</h1>
            </div>
            <div className="back-to-main" onClick={() => navigate("/")}>BACK TO MAIN</div>
        </div>

    )
};

export default OrderPaid;