import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CheckoutItems from "./CheckoutItems";
import ShippingAddressForm from "./forms/ShippingAddressForm";

import "./Checkout.css";

import logo from "../../media/static_images/img.png";
import forwardImg from "../../media/static_images/forward_to.svg";
import {Link, useNavigate, useParams} from "react-router-dom";
import ShippingMethodForm from "./forms/ShippingMethodForm";
import PaymentForm from "./forms/PaymentForm";
import {toggleCart} from "../../redux/slices/menuSlice";
import AuthService from "../api/authService";
import {getCartItems} from "../cart/api/asyncThunks";
import {getShippingAddressAsTrue, getShippingAddresses, getUsernameEmail} from "./forms/reducers/asyncThunks";
import {
    createOrUpdateAddress,
    getCountries,
    getOrderDetail,
    getPhoneCodes,
    getProvinces, getShippingMethodDetail,
    getShippingMethods, updateOrderShippingMethod
} from "./api/asyncThunks";


const Checkout = () => {
    window.document.title = 'Timshee | Checkout';
    const token = AuthService.getCurrentUser();
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        countries, phoneCodes, provinces, order, shippingMethods,
        countriesStatus, phoneCodesStatus, provincesStatus, orderStatus, shippingMethodsStatus,
    } = useSelector(state => state.order);

    const {
        addressObject, usernameEmail, shippingAddresses,
        addressObjectStatus, usernameEmailStatus, shippingAddressesStatus
    } = useSelector(state => state.shippingAddressForm);

    const {cart, getCartItemsStatus} = useSelector(state => state.cart);

    // FOR ORDER SHIPPING FORM
    const [orderShippingAddress, setOrderShippingAddress] = React.useState();

    // FOR OPEN PAYMENT FORM
    const [orderShippingMethod, setOrderShippingMethod] = React.useState();


    const [shippingMethodExternal, setShippingMethodExternal] = React.useState(0);
    const [shippingPrice, setShippingPrice] = React.useState(0.00);
    const [currentStep, setCurrentStep] = React.useState(localStorage.getItem("currentStep") || "information");

    // INIT
    useEffect(() => {
        if (countriesStatus === 'idle') {
            dispatch(getCountries());
        }
        if (phoneCodesStatus === 'idle') {
            dispatch(getPhoneCodes());
        }
        if (provincesStatus === 'idle') {
            dispatch(getProvinces());
        }
        if (shippingAddressesStatus === 'idle') {
            dispatch(getShippingAddresses({token}));
        }
        if (addressObjectStatus === 'idle') {
            dispatch(getShippingAddressAsTrue({token}));
        }

        if (shippingMethodsStatus === 'idle') {
            dispatch(getShippingMethods());
        }

        if (usernameEmailStatus === 'idle' && token) {
            dispatch(getUsernameEmail({token}));
        }

        if (orderStatus === 'idle') {
            dispatch(getOrderDetail({orderId: params.orderId, token}));
        }

    }, [
        countriesStatus, phoneCodesStatus, provincesStatus,
        shippingAddressesStatus, addressObjectStatus, usernameEmailStatus,
    ]);

    // SET CHECKOUT ITEMS
    useEffect(() => {
        if (getCartItemsStatus === 'idle') {
            dispatch(getCartItems());
        }
    }, [cart.cartItems.length, getCartItemsStatus]);

    // OPEN FORMS
    useEffect(() => {
        if (order && order.shipping_address !== undefined) {
            setOrderShippingAddress(order.shipping_address);
        }

        if (order && order.shipping_methods !== undefined) {
            setOrderShippingMethod(order.shipping_method)
        }
    })

    // CHANGE STEP
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

    // SET SHIPPING PRICE DATA
    const setCorrectShippingPrice = () => {
        if (currentStep !== "information" && orderShippingMethod !== undefined) {
            setShippingPrice(order.shipping_method.price);
        }
    };

    // HANDLE STEPS
    const handleSubmitShippingAddressForm = async e => {
        e.preventDefault();

        const data = {
            "orderId": params.orderId,
            "first_name": addressObject.firstName,
            "last_name": addressObject.lastName,
            "city": addressObject.city,
            "address1": addressObject.streetAddress,
            "address2": addressObject.apartment,
            "postal_code": addressObject.postalCode,
            // WEAK
            "phone_number": addressObject.phoneNumber,
            "email": addressObject.email || usernameEmail,
            "additional_data": "",
            // WEAK
            "province": addressObject.province.id,
            "phone_code": addressObject.phoneCode.country,
            "as_primary": true,
        }

        dispatch(createOrUpdateAddress({
            shippingAddress: data,
            shippingAddressId: addressObject.id,
            token,
        }));
        navigate(`/shop/${params.orderId}/checkout/shipping`);
        setCurrentStep("shipping");
    };

    const handleSubmitShippingMethodForm = async e => {
        e.preventDefault();

        const selectedMethod = shippingMethods.find(
            method => method.id === shippingMethodExternal
        );
        dispatch(updateOrderShippingMethod({
            orderId: params.orderId,
            shippingMethodId: shippingMethodExternal,
            token
        }));
        dispatch(getShippingMethodDetail({
            shippingMethodId: selectedMethod.id
        }));
        setShippingPrice(selectedMethod.price);
        setCurrentStep("payment");
        navigate(`/shop/${params.orderId}/checkout/payment`);
    };

    // UPDATE STEPS
    useEffect(() => {
        localStorage.setItem("currentStep", currentStep);
    }, [currentStep]);

    return (
        <div className="checkout-container">
            <div className="checkout-shipping-information">
                <div className="checkout-header-navigation">
                    <div className="checkout-logo">
                        <img src={logo} alt="alt-logo" height={40}/>
                    </div>
                    {cart.cartItems.length > 0 && <div className="checkout-nav">
                        <span>
                            <Link to={`/cart`} onClick={() => {
                                handleStepChange("information");
                                dispatch(toggleCart(false));
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
                {cart.cartItems.length > 0 && <div className="checkout-shipping-form">
                    {
                        currentStep === "information"
                        &&
                        <ShippingAddressForm
                            initialValue={addressObject}
                            shippingAddresses={shippingAddresses}
                            usernameEmail={usernameEmail}
                            orderId={params.orderId}
                            countries={countries}
                            phoneCodes={phoneCodes}
                            provinces={provinces}
                            submit={handleSubmitShippingAddressForm}
                            setCurrentStep={handleStepChange}
                        />
                    }
                    {
                        currentStep === "shipping"
                        &&
                        <ShippingMethodForm
                            initialValue={shippingMethods}
                            orderId={params.orderId}
                            setShippingPrice={setShippingPrice}
                            setOrderShippingMethod={setOrderShippingMethod}
                            setShippingMethodExternal={setShippingMethodExternal}
                            submit={handleSubmitShippingMethodForm}
                            setCurrentStep={handleStepChange}
                        />
                    }
                    {
                        currentStep === "payment"
                        &&
                        <PaymentForm orderId={params.orderId}/>
                    }
                </div>}
            </div>
            {
                cart.cartItems.length > 0 ? (
                    <div className="checkout-items-container">
                        <div className="checkout-items">
                            <CheckoutItems cart={cart}/>
                        </div>
                        <div className="checkout-subtotal">
                            <div className="checkout-fees">
                            <span>Subtotal:</span>
                                <span>{cart.totalPrice}</span>
                            </div>
                            <div className="checkout-shipping">
                                <span>Shipping:</span>
                                <span>{parseFloat(shippingPrice) === 0.00 ? "Free" : shippingPrice}</span>
                            </div>
                        </div>
                        <div className="checkout-total">
                            <span>Total:</span>
                            <span>{(parseFloat(cart.totalPrice) + parseFloat(shippingPrice)).toFixed(2)}</span>
                        </div>
                    </div>
                ) : (
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
                )
            }
        </div>
    )
};

export default Checkout;