import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getShippingMethodDetail,
    getShippingMethods,
    setStep,
    updateOrderShippingMethod
} from "../../../redux/slices/shopSlices/orderSlice";
import backImg from "../../../media/static_images/back_to.svg";
import {Link, useNavigate} from "react-router-dom";

import "./CheckoutForms.css";

const ShippingMethodForm = ({totalPrice, orderId, orderNumber, setShippingPrice }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const shippingMethodStorage = JSON.parse(localStorage.getItem("order"))["shipping_method"];

    const [shippingMethod, setShippingMethod] = useState(0);
    const [shippingPriceInternal, setShippingPriceInternal] = useState(0.00);

    const {shippingMethodData, steps} = useSelector(state => state.order);
    const isAuthenticated = useSelector((state) => state.auth.isValid);

    useEffect(() => {
        if (shippingMethodData.shippingMethods.length > 0) {

            if (shippingMethodStorage === undefined) {
                setShippingMethod(shippingMethodData.shippingMethods[0].id);
                setShippingPrice(shippingMethodData.shippingMethods[0].price);
            }
            else {
                setShippingMethod(shippingMethodStorage);
                setShippingPrice(shippingMethodData.shippingMethod?.price);
            }

        }
    }, [shippingMethodData]);

    useEffect(() => {
        dispatch(getShippingMethods());
    }, [])

    useEffect(() => {
        dispatch(getShippingMethodDetail({shippingMethodId: shippingMethodStorage || 0}));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const shipMethod = shippingMethod !== 0 ? shippingMethod : JSON.parse();
        dispatch(updateOrderShippingMethod({
            orderId, shippingMethodId: shippingMethod, isAuthenticated
        }));
        dispatch(setStep(steps[2]));
        navigate(`/shop/${orderNumber}/checkout/${steps[2].step}`);
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
                                       setShippingPriceInternal(method.price)
                                   }}/>
                            <span>{method.shipping_name}</span>
                        </label>
                        <div className="shipping-price">{method.price === "0.00" ? "Free" : method.price}</div>
                    </div>
                ))}
                <div className="form-submit">
                    <div>
                        <img src={backImg} alt="alt-back-to-info" height={14}/>
                        <Link to={`/shop/${orderNumber}/checkout`} onClick={() => dispatch(setStep(steps[2]))}>
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