import React, {useEffect} from 'react';
import {Navigate, useParams} from "react-router-dom";

import {checkPaymentStatus} from "../../../main/order(old)/api";
import AuthService from "../../../main/api(old)/authService";
import Error from "../../Error";

const OrderCheckPayment = () => {
    const params = useParams();
    const token = AuthService.getAccessToken();

    const orderId = params.orderId;
    const orderNumber = params.orderNumber;

    const [status, setStatus] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setIsLoading] = React.useState(false);


    useEffect(() => {
        const fetchStatus = async () => {
            if (orderNumber !== undefined) {
                const result = await checkPaymentStatus({
                    orderNumber, setError, setIsLoading, token
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
        return <Navigate to={`/order/${orderId}/check/failed?order_number=${orderNumber}`} />
    }

    if (status === "succeeded") {
        return <Navigate to={`/order/${orderId}/check/paid?order_number=${orderNumber}`} />
    }

    if (status === undefined) {
        return <Error />
    }
};

export default OrderCheckPayment;