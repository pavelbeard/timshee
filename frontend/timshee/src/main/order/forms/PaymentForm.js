import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createPayment} from "../api";

const PaymentForm = ({ orderId }) => {
    const isAuthenticated = useSelector(state => state.auth.isValid);

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const paymentData = {
            "order_id": orderId,
        };

        const result = await createPayment({
            paymentData, setError, setIsLoading, isAuthenticated,
        });

        setRedirectUrl(result['confirmation_url']);
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