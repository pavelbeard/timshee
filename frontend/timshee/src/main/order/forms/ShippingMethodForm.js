import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
} from "../api/reducers/orderSlice";
import backImg from "../../../media/static_images/back_to.svg";
import {Link, useNavigate} from "react-router-dom";

import "./CheckoutForms.css";
import AuthService from "../../api/authService";
import {getShippingMethodDetail, getShippingMethods, updateOrderShippingMethod} from "../api/asyncThunks";

const ShippingMethodForm = ({
    initialValue: shippingMethods,
    orderId,
    setCurrentStep,
    setShippingPrice,
    setOrderShippingMethod,
    setShippingMethodExternal,
    submit
}) => {
    const [shippingMethod, setShippingMethod] = useState(0);

    const {shippingMethodData, order: shippingMethodPreset} = useSelector(state => state.order);
    const isAuthenticated = AuthService.isAuthenticated();


    if (shippingMethods.length > 0) {
        return(
            <form onSubmit={submit}>
                <span className="shipping-address">
                    <h3>Shipping method</h3>
                </span>
                {shippingMethods.map((method, index) => (
                    <div className="shipping-method" key={index}>
                        <label htmlFor={`method-${method.id}`}>
                            <input required={shippingMethod === method.id}
                                   type="radio"
                                   value={method.id}
                                   checked={shippingMethod === method.id}
                                   onChange={e => {
                                       setShippingMethodExternal(parseInt(e.target.value))
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
                    <button type="submit" onSubmit={submit}>
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