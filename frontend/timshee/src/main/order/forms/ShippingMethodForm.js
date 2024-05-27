import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getOrderDetail,
    getShippingMethodDetail,
    getShippingMethods,
    setStep,
    updateOrderShippingMethod
} from "../../../redux/slices/shopSlices/orderSlice";
import backImg from "../../../media/static_images/back_to.svg";
import {Link, useNavigate} from "react-router-dom";

import "./CheckoutForms.css";

const ShippingMethodForm = ({ orderId, setCurrentStep, setShippingPrice, setOrderShippingMethod }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [shippingMethod, setShippingMethod] = useState(0);

    const {shippingMethodData, order: shippingMethodPreset} = useSelector(state => state.order);
    const isAuthenticated = useSelector((state) => state.auth.isValid);

    











    useEffect(() => {
        dispatch(getShippingMethods());
    }, []);

    useEffect(() => {
        if (shippingMethodPreset && shippingMethodPreset.shipping_method) {
            setShippingMethod(shippingMethodPreset.shipping_method.id);
            setShippingPrice(shippingMethodPreset.shipping_method.price);
        }
    }, [shippingMethodPreset, setShippingPrice, setOrderShippingMethod]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedMethod = shippingMethodData.shippingMethods.find(
            method => method.id === shippingMethod
        );
        dispatch(updateOrderShippingMethod({
            orderId,
            shippingMethodId: shippingMethod,
            isAuthenticated
        }));
        dispatch(getShippingMethodDetail({
            shippingMethodId: selectedMethod.id
        }));
        setShippingPrice(selectedMethod.price);
        setOrderShippingMethod(selectedMethod);
        setCurrentStep("payment");
        navigate(`/shop/${orderId}/checkout/payment`);
    };

    if (shippingMethodData.shippingMethods.length > 0) {
        return(
            <form onSubmit={handleSubmit}>
                <span className="shipping-address">
                    <h3>Shipping method</h3>
                </span>
                {shippingMethodData.shippingMethods.map((method, index) => (
                    <div className="shipping-method" key={index}>
                        <label htmlFor={`method-${method.id}`}>
                            <input required={shippingMethod === method.id}
                                   type="radio" value={method.id} checked={shippingMethod === method.id}
                                   onChange={e => {
                                       setShippingMethod(parseInt(e.target.value));
                                       setShippingPrice(method.price);
                                   }}/>
                            <span>{method.shipping_name}</span>
                        </label>
                        <div className="shipping-price">{method.price === "0.00" ? "Free" : method.price}</div>
                    </div>
                ))}
                <div className="form-submit">
                    <div>
                        <img src={backImg} alt="alt-back-to-info" height={14}/>
                        <Link to={`/shop/${orderId}/checkout`} onClick={
                            () => setCurrentStep("information")
                        }>
                            Return to information
                        </Link>
                    </div>
                    <button type="submit" onSubmit={handleSubmit}>
                        Continue to payment
                    </button>
                </div>
            </form>
        )
    } else {
        return (
            <div>
                LOADING...
            </div>
        )
    }
};

export default ShippingMethodForm;