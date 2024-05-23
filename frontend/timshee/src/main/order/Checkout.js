import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    checkout,
    getCountries, getOrders,
    getPhoneCodes,
    getProvinces,
    getShippingAddress, getShippingMethods,
    resetOrderStates, setStep
} from "../../redux/slices/shopSlices/orderSlice";
import CheckoutItems from "./CheckoutItems";
import ShippingAddressForm from "./forms/ShippingAddressForm";

import "./Checkout.css";

import logo from "../../media/static_images/img.png";
import forwardImg from "../../media/static_images/forward_to.svg";
import {Link, Navigate, useNavigate} from "react-router-dom";
import ShippingMethodForm from "./forms/ShippingMethodForm";
import PaymentForm from "./forms/PaymentForm";


// STATUS_CHOICES = (
//         ('created', 'CREATED'),
//         ('pending_for_pay', 'PENDING FOR PAY'),
//         ('processing', 'PROCESSING'),
//         ('completed', 'COMPLETED'),
//         ('cancelled', 'CANCELLED'),
//     )



const Checkout = () => {
    window.document.title = 'Timshee | Checkout';

    const currentStep = JSON.parse(localStorage.getItem("step"));

    const orderNumber = JSON.parse(localStorage.getItem("order"))['order_number'];
    const orderId = JSON.parse(localStorage.getItem("order"))['id'];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [totalPrice, setTotalPrice] = React.useState(0.00);
    const [orderShippingAddress, setOrderShippingAddress] = React.useState();
    const [orderShippingMethod, setOrderShippingMethod] = React.useState();
    const [shippingPrice, setShippingPrice] = React.useState(0.00);

    const {step, steps, countries,
        phoneCodes, provinces, orderData} = useSelector(state => state.order);
    const isAuthenticated = useSelector(state => state.auth.isValid);


    // switch (currentStep?.step) {
    //     case "information":
    //         navigate(`/shop/${orderNumber}/checkout/information`);
    //         break;
    //     case "shipping":
    //         navigate(`/shop/${orderNumber}/checkout/shipping`);
    //         break
    //     case "payment":
    //         navigate(`/shop/${orderNumber}/checkout/payment`);
    //         break;
    // }


    useEffect(() => {

    }, [shippingPrice]);

    useEffect(() => {
        if (step === undefined || step === null) {
            dispatch(setStep(steps[0]));
        }
    }, [step]);

    useEffect(() => {
        if (orderData.order !== undefined) {
            setOrderShippingAddress(orderData.order.shipping_address);
            setOrderShippingMethod(orderData.order.shipping_method);
        }
    }, [orderData]);

    useEffect(() => {
        if (document.location.pathname === "/checkout") {
            dispatch(resetOrderStates());
        }
    }, []);

    useEffect(() => {
        setTotalPrice(JSON.parse(localStorage.getItem('order'))['ordered_items']['total_price']);
        dispatch(getCountries());
        dispatch(getPhoneCodes());
        dispatch(getProvinces());
        dispatch(getOrders({orderId, isAuthenticated}));
    }, []);

    const checkoutItemsContainer = () => {
        return (
            <div className="checkout-items-container">
                <div className="checkout-items"><CheckoutItems/></div>
                <div className="checkout-subtotal">
                    <div className="checkout-fees">
                        <span>Subtotal:</span>
                        <span>{totalPrice}</span>
                    </div>
                    <div className="checkout-shipping">
                        <span>Shipping:</span>
                        <span>{parseFloat(shippingPrice) === 0.00 ? "Free" : shippingPrice}</span>
                    </div>
                </div>
                <div className="checkout-total">
                    <span>Total:</span>
                    <span>{(totalPrice + parseFloat(shippingPrice)).toFixed(2)}</span>
                </div>
            </div>
        )
    };

    return (
        <div className="checkout-container">
            <div className="checkout-shipping-information">
                <div className="checkout-header-navigation">
                    <div className="checkout-logo">
                        <img src={logo} alt="alt-logo" height={40}/>
                    </div>
                    <div className="checkout-nav">
                        <span>
                            <Link to={`/cart`} onClick={() => dispatch(resetOrderStates())}>
                                Cart
                            </Link>
                        </span>
                        <img src={forwardImg} alt="alt-forward-to-1" height={10}/>
                        <span className={step?.value > 0 ? "span-color-black" : "span-color-gray"}
                              onClick={() => {
                                  dispatch(setStep(steps[0]));
                                  navigate(`/shop/${orderNumber}/checkout/${steps[0].step}/`);
                              }}>
                            Information
                        </span>
                        <img src={forwardImg} alt="alt-forward-to-2" height={10}/>
                        <span className={step?.value > 1 && orderShippingAddress ? "span-color-black" : "span-color-gray"}
                              onClick={() => {
                                  if (orderShippingAddress !== undefined) {
                                      dispatch(setStep(steps[1]));
                                      navigate(`/shop/${orderNumber}/checkout/${steps[1].step}/`);
                                  }
                              }}>
                            Shipping
                        </span>
                        <img src={forwardImg} alt="alt-forward-to-3" height={10}/>
                        <span className={step?.value > 2 ? "span-color-black" : "span-color-gray"}
                              onClick={() => {
                                  dispatch(setStep(steps[2]));
                                  navigate(`/shop/${orderNumber}/checkout/${steps[2].step}/`);
                              }}>
                            Payment
                        </span>
                    </div>
                </div>
                <div className="checkout-shipping-form">
                    {
                        step?.step === "information"
                        &&
                        <ShippingAddressForm
                            orderNumber={orderNumber}
                            countries={countries}
                            phoneCodes={phoneCodes}
                            provinces={provinces}
                        />
                    }
                    {
                        (step?.step === "shipping" && orderShippingAddress !== undefined)
                        &&
                        <ShippingMethodForm
                            totalPrice={totalPrice}
                            orderId={orderId}
                            orderNumber={orderNumber}
                            setShippingPrice={setShippingPrice}
                        />
                    }
                    {
                        (step?.step === "payment" && orderShippingMethod !== undefined)
                        &&
                        <PaymentForm orderId={orderId} />
                    }
                </div>
            </div>
            {checkoutItemsContainer()}
        </div>
    )
};

export default Checkout;