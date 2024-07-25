import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import "../../OrderStatus.css";
import {useDispatch, useSelector} from "react-redux";
import {clearCart} from "../../../../../cart/api/asyncThunks";
import {updateOrderStatus, updatePaymentInfo} from "../../../../api/asyncThunks";
import AuthService from "../../../../../api/authService";
import translateService from "../../../../../translate/TranslateService";

const OrderPaid = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const language = translateService.language();

    const orderId = params.orderId;
    const orderNumber = params.orderNumber;

    const token = AuthService.getAccessToken();

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
                token,
                status: "processing",
            }));
            dispatch(clearCart({
                token,
                hasOrdered: true
            }));
            localStorage.setItem("currentStep", 1);
        }
    };

    useEffect(() => {
        updateInfo();
    }, []);

    return(
        <div className="order-status">
            <div className="order-paid">
                <h1 style={{
                    textAlign: "center"
                }}>{translateService.orderPaid[language].split('.')[0]} {orderNumber} {translateService.orderPaid[language].split('.')[1]}</h1>
            </div>
            <div className="back-to-main" onClick={() => navigate(`/`)}>BACK TO MAIN</div>
        </div>

    )
};

export default OrderPaid;