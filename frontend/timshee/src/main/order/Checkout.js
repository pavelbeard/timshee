import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getCountries,
    getOrderDetail,
    getPhoneCodes,
    getProvinces,
    resetOrderId,
} from "../../redux/slices/shopSlices/orderSlice";
import CheckoutItems from "./CheckoutItems";
import ShippingAddressForm from "./forms/ShippingAddressForm";

import "./Checkout.css";

import logo from "../../media/static_images/img.png";
import forwardImg from "../../media/static_images/forward_to.svg";
import {Link, useNavigate, useParams} from "react-router-dom";
import ShippingMethodForm from "./forms/ShippingMethodForm";
import PaymentForm from "./forms/PaymentForm";
import {getOrder} from "./api";
import {setOrderedData, setTotalPrice} from "./api/checkoutSlice";
import {toggleCart} from "../../redux/slices/menuSlice";


const Checkout = () => {
    window.document.title = 'Timshee | Checkout';

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {countries, phoneCodes, provinces,
        orderData, order
    } = useSelector(state => state.order);
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {isLoading, error, totalPrice, orderedData} = useSelector(state => state.checkout);

    const [orderShippingAddress, setOrderShippingAddress] = React.useState();
    const [orderShippingMethod, setOrderShippingMethod] = React.useState();
    const [shippingPrice, setShippingPrice] = React.useState(0.00);
    const [currentStep, setCurrentStep] = React.useState(localStorage.getItem("currentStep") || "information");

    // SET CHECKOUT ITEMS
    useEffect(() => {
        const fetchOrder = async () => {
            const result = await getOrder({
                orderId: params.orderId,
                isAuthenticated,
                dispatch,
            });

            if (result) {
                dispatch(setOrderedData(result.ordered_items.data));
                dispatch(setTotalPrice(result.ordered_items.total_price));
            }
        };

        fetchOrder();
    }, []);

    // SET SHIPPING ADDRESS DATA

    const setCorrectShippingPrice = () => {
        if (currentStep !== "information" && orderShippingMethod !== undefined) {
            setShippingPrice(order.shipping_method.price);
        }
    };

    useEffect(() => {
    }, [order]);

    useEffect(() => {
        if (order) {
            setOrderShippingAddress(order.shipping_address);
            setOrderShippingMethod(order.shipping_method);
            setCorrectShippingPrice();
        }
    }, [order, currentStep]);

    useEffect(() => {
        dispatch(getCountries());
        dispatch(getPhoneCodes());
        dispatch(getProvinces());
        dispatch(getOrderDetail({isAuthenticated, orderId: params.orderId}))
    }, [dispatch, isAuthenticated, params.orderId]);

    useEffect(() => {
        localStorage.setItem("currentStep", currentStep);
    }, [currentStep]);

    const handleStepChange = (nextStep) => {
        if (nextStep === "information") {
            setShippingPrice(0.00);
        }

        if (nextStep === "shipping" && orderShippingAddress === undefined) {
            return;
        }

        if (nextStep === "payment" && orderShippingMethod === undefined) {
            return;
        }

        setCurrentStep(nextStep);
    };

    const checkoutItemsContainer = () => {
        return (
            <div className="checkout-items-container">
                <div className="checkout-items">
                    <CheckoutItems items={orderedData}/>
                </div>
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
                    {order !== undefined && <div className="checkout-nav">
                        <span>
                            <Link to={`/cart`} onClick={() => {
                                handleStepChange("information");
                                dispatch(toggleCart(false));
                                // dispatch(resetOrderId());
                            }}>
                                Cart
                            </Link>
                        </span>
                        <img src={forwardImg} alt="alt-forward-to-1" height={10}/>
                        <span className={currentStep === "information" ? "span-color-black" : "span-color-gray"}
                              onClick={() => {
                                  handleStepChange("information");
                                  setShippingPrice(0.00);
                                  navigate(`/shop/${params.orderId}/checkout/information`);
                              }}>
                            Information
                        </span>
                        <img src={forwardImg} alt="alt-forward-to-2" height={10}/>
                        <span
                            className={currentStep === "shipping" && orderShippingAddress ? "span-color-black" : "span-color-gray"}
                            onClick={() => {
                                if (orderShippingAddress !== undefined) {
                                    handleStepChange("shipping");
                                    navigate(`/shop/${params.orderId}/checkout/shipping`);
                                }
                            }}>
                            Shipping
                        </span>
                        <img src={forwardImg} alt="alt-forward-to-3" height={10}/>
                        <span className={currentStep === "payment" ? "span-color-black" : "span-color-gray"}
                              onClick={() => {
                                  if (orderShippingMethod !== undefined) {
                                      handleStepChange("payment");
                                      navigate(`/shop/${params.orderId}/checkout/payment`);
                                  }
                              }}>
                            Payment
                        </span>
                    </div>}
                </div>
                {order !== undefined && <div className="checkout-shipping-form">
                    {
                        currentStep === "information"
                        &&
                        <ShippingAddressForm
                            orderId={params.orderId}
                            countries={countries}
                            phoneCodes={phoneCodes}
                            provinces={provinces}
                            setCurrentStep={handleStepChange}
                        />
                    }
                    {
                        currentStep === "shipping"
                        &&
                        <ShippingMethodForm
                            orderId={params.orderId}
                            setCurrentStep={handleStepChange}
                            setShippingPrice={setShippingPrice}
                            setOrderShippingMethod={setOrderShippingMethod}
                        />
                    }
                    {
                        currentStep === "payment"
                        &&
                        <PaymentForm orderId={params.orderId}/>
                    }
                </div>}
            </div>
            {order !== undefined
                ? checkoutItemsContainer()
                :
                <div style={{
                    display: "flex",
                    paddingTop: "4rem",
                    justifyContent: "center",
                    width: "45%",
                }}>
                    <span>
                        <h3>LOADING...</h3>
                    </span>
                </div>
            }
        </div>
    )
};

export default Checkout;