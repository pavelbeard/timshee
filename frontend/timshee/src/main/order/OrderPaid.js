import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import "./OrderStatus.css";
import {useDispatch, useSelector} from "react-redux";
import {clearCart, deleteCartItems} from "../cart/api/asyncThunks";
import {updateOrderStatus, updatePaymentInfo} from "./api/asyncThunks";
import {setError} from "./api/reducers/checkoutSlice";
import AuthService from "../api/authService";

const OrderPaid = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();

    const orderId = params.orderId;
    const orderNumber = params.orderNumber;

    const isAuthenticated = AuthService.isAuthenticated();
    const {paymentId} = useSelector(state => state.checkout);

    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const updateInfo = () => {
        if (orderId !== undefined) {
            dispatch(updatePaymentInfo({
                storeOrderNumber: orderNumber,
                data: {
                    status: "succeeded"
                },
                setError: setError,
                setIsLoading: setIsLoading,
            }))
            dispatch(updateOrderStatus({
                orderId: orderId,
                isAuthenticated: isAuthenticated,
                status: "processing",
            }));
            dispatch(clearCart({
                isAuthenticated: isAuthenticated,
                hasOrdered: true
            }));
            localStorage.setItem("currentStep", "information");
        }
    };

    useEffect(() => {
        updateInfo();
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