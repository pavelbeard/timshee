import React, {useEffect} from 'react';
import {Navigate, useParams} from "react-router-dom";

import "./OrderStatus.css";
import {checkPaymentStatus} from "../../api";
import Error from "../../../techPages/Error";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../../redux/services/features/auth/authSlice";

const OrderCheckPayment = () => {
    const params = useParams();
    const token = useSelector(selectCurrentToken);

    const orderId = params.orderId;
    const orderNumber = params.orderNumber;

    const [status, setStatus] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setIsLoading] = React.useState(false);


    useEffect(() => {
        const fetchStatus = async () => {
            if (orderId !== undefined) {
                const result = await checkPaymentStatus({
                    orderId, setError, setIsLoading, token
                });

                if (result) {
                    setStatus(result['status']);
                } else {
                    setStatus(undefined);
                }
            }
        };

        fetchStatus();
    }, []);

    if (status === "") {
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

    if (status === undefined) {
        return <Error />
    }
};

export default OrderCheckPayment;