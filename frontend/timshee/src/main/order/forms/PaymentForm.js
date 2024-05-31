import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createPayment, updateOrder} from "../api";
import AuthService from "../../api/authService";

import "./CheckoutForms.css"

const PaymentForm = ({ orderId }) => {
    const dispatch = useDispatch();

    const {paymentId} = useSelector(state => state.checkout);
    const isAuthenticated = AuthService.isAuthenticated();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const paymentData = {
            "order_id": orderId,
        };

        const updateOrderResult = await updateOrder({
            orderId: orderId,
            data: {
                "status": "pending_for_pay"
            },
            isAuthenticated: isAuthenticated,
            setError: setError,
            setIsLoading: setIsLoading,
        });

        if (updateOrderResult) {
            const createPaymentResult = await createPayment({
                paymentData, setError, setIsLoading, isAuthenticated,
            });

            setRedirectUrl(createPaymentResult['confirmation_url']);
        }
    };

    useEffect(() => {
        if (redirectUrl !== undefined) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl])

    return (
        <div className="payment-form-container">
            <form onSubmit={handleSubmit}>
                <button className="payment-form-button" type="submit">Pay now</button>
            </form>
        </div>
    )
};

export default PaymentForm;