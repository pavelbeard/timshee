import React, { useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import {createPayment} from "../../../redux/slices/shopSlices/payment";
import {Navigate} from "react-router-dom";
import {deleteOrder} from "../../../redux/slices/shopSlices/checkout";

const PaymentForm = ({ orderId }) => {
    const dispatch = useDispatch();
    const [redirectUrl, setRedirectUrl] = useState();

    useEffect( () => {
        const fetchRedirect = async () => {
            const paymentResult = await createPayment({orderId});

            if (paymentResult !== undefined) {
                setRedirectUrl(paymentResult);
            } else if (paymentResult) {

            }
        }

        fetchRedirect();
    }, [])

    if (redirectUrl === undefined) {
        return(
            <div>
                Loading...
            </div>
        )
    } else {
        window.location.href = redirectUrl;
    }
};

export default PaymentForm;