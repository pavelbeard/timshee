import React, {useEffect} from 'react';
import {Navigate, useNavigate, useParams} from "react-router-dom";

import "./OrderStatus.css";
import {changeQuantity, deleteCartItems, getCollections} from "../../redux/slices/shopSlices/itemSlice";
import {useDispatch, useSelector} from "react-redux";
import {updateOrderStatus} from "../../redux/slices/shopSlices/orderSlice";
import OrderIsNotPaid from "./OrderIsNotPaid";
import {checkPaymentStatus} from "./api";

const OrderCheckPayment = () => {
    const params = useParams();
    const navigate = useNavigate();

    const orderId = params.orderId;
    const orderNumber = params.orderNumber;

    const [status, setStatus] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setIsLoading] = React.useState(false);


    useEffect(() => {
        const fetchStatus = async () => {
            if (orderNumber !== undefined) {
                const result = await checkPaymentStatus({
                    orderNumber, setError, setIsLoading
                });
                setStatus(result['status']);
            }
        };

        fetchStatus();
    }, []);

    if (status === "" || status === undefined) {
        return(
            <div className="order-status">
                <div className="order-paid">
                    <h1>Loading...</h1>
                </div>
            </div>
        )
    }

    if (status === "pending") {
        return <Navigate to={`/shop/${orderId}/checkout/order-failed/${orderNumber}`} />
    }

    if (status === "succeeded") {
        return <Navigate to={`/shop/${orderId}/checkout/order-paid/${orderNumber}`} />
    }
};

export default OrderCheckPayment;