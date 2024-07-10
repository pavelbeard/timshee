import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createPayment, updateOrder} from "../../../api";
import AuthService from "../../../../api/authService";

import "./CheckoutForms.css";

import t from "../../../../translate/TranslateService";

const PaymentForm = ({ orderId }) => {
    const language = t.language();

    const token = AuthService.getCurrentUser();

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
            isAuthenticated: token,
            setError: setError,
            setIsLoading: setIsLoading,
        });

        if (updateOrderResult) {
            const createPaymentResult = await createPayment({
                paymentData, setError, setIsLoading, token,
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
                <button className="payment-form-button" type="submit">{t.checkout.payment[language]}</button>
            </form>
        </div>
    )
};

export default PaymentForm;