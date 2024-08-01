import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CheckoutItems from "../../../components/orders/checkout/CheckoutItems";
import ShippingAddressForm from "../../../components/orders/checkout/forms/ShippingAddressForm";

import logo from "../../../assets/logo.png";
import forwardImg from "../../../assets/forward_to.svg";
import {Link, useNavigate, useParams} from "react-router-dom";
import ShippingMethodForm from "../../../components/orders/checkout/forms/ShippingMethodForm";
import PaymentForm from "../../../components/orders/checkout/forms/PaymentForm";
import {toggleCart} from "../../../redux(old)/slices/menuSlice";
import AuthService from "../../../main/api(old)/authService";
import {getCartItems} from "../../cart/api(old)/asyncThunks";
import {
    createOrUpdateAddress,
    getShippingAddresses,
    getUsernameEmail
} from "../../../main/order(old)/checkout(old)/pages/forms/reducers/asyncThunks";
import {
    getCountries, getOrderDetail,
    getPhoneCodes,
    getProvinces, getShippingMethodDetail,
    getShippingMethods, updateOrderShippingMethod
} from "../../../main/order(old)/api/asyncThunks";
import t from "../../../main/translate(old)/TranslateService";
import {clsx} from "clsx";


const Checkout = () => {
    window.document.title = 'Timshee | Checkout';
    const token = AuthService.getAccessToken();
    const language = t.language();
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        usernameEmail, shippingAddresses, shippingMethods, countries, phoneCodes, provinces,
        addressObjectStatus, usernameEmailStatus, shippingAddressesStatus,
        countriesStatus, phoneCodesStatus, provincesStatus, orderStatus, shippingMethodsStatus,
        addressFormObject, order
    } = useSelector(state => state.shippingAddressForm);
    const {cart, getCartItemsStatus} = useSelector(state => state.cart);

    const [shippingMethodExternal, setShippingMethodExternal] = React.useState(0);
    const [shippingPrice, setShippingPrice] = React.useState(0.00);
    const [currentStep, setCurrentStep] = React.useState(
        parseInt(localStorage.getItem("currentStep"))|| 1
    );
    const [shippingAddressString, setShippingAddressString] = React.useState("");

    // INIT
    useEffect(() => {
        if (countriesStatus === 'idle') {
            dispatch(getCountries());
        }
        if (phoneCodesStatus === 'idle' && addressFormObject === undefined) {
            dispatch(getPhoneCodes());
        }
        if (provincesStatus === 'idle' && addressFormObject === undefined) {
            dispatch(getProvinces());
        }
        if (shippingAddressesStatus === 'idle') {
            dispatch(getShippingAddresses({token}));
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

    useEffect(() => {
        if (addressFormObject) {
            setShippingAddressString(
                `${addressFormObject?.address1}, ` +
                `${addressFormObject?.address2}, ` +
                `${addressFormObject?.postal_code}, ` +
                `${addressFormObject?.province?.name}, ` +
                `${addressFormObject?.city}, ` +
                `${addressFormObject?.province?.country?.name}, ` +
                `${addressFormObject?.first_name} ${addressFormObject?.last_name}`
            )
        }
    }, [addressFormObject])

    // CHANGE STEP
    const handleStepChange = (nextStep) => {
        if (nextStep === 1) {
            setShippingPrice(0.00);
        }

        if (nextStep === 2 && order.shipping_address === undefined) {
            return;
        }

        if (nextStep === 3 && order.shipping_method === undefined) {
            return;
        }

        setCurrentStep(nextStep);
    };

    // SET SHIPPING PRICE DATA

    // HANDLE STEPS
    const toShipping = () => {
        navigate(`/shop/${params.orderId}/checkout/shipping`);
        setCurrentStep(2);
    };


    const handleSubmitShippingAddressForm = async e => {
        e.preventDefault();
        const data = {
            "order_id": params.orderId,
            "first_name": addressFormObject.first_name,
            "last_name": addressFormObject.last_name,
            "city": addressFormObject.city,
            "address1": addressFormObject.address1,
            "address2": addressFormObject.address2,
            "postal_code": addressFormObject.postal_code,
            "phone_number": addressFormObject.phone_number,
            "email": addressFormObject.email || usernameEmail,
            "additional_data": "",
            "province": addressFormObject?.province?.id || provinces[0].id,
            "phone_code": addressFormObject?.phone_code?.country || phoneCodes[0].country,
            "as_primary": true,
        };

        dispatch(createOrUpdateAddress({
            shippingAddress: data,
            shippingAddressId: addressFormObject?.id,
            token,
        }));

        setShippingAddressString(
            `${addressFormObject?.address1}, ` +
            `${addressFormObject?.address2}, ` +
            `${addressFormObject?.postal_code}, ` +
            `${addressFormObject?.province?.name}, ` +
            `${addressFormObject?.city}, ` +
            `${addressFormObject?.province?.country?.name}, ` +
            `${addressFormObject?.first_name} ${addressFormObject?.last_name}`
        );

        navigate(`/shop/${params.orderId}/checkout/shipping`);
        setCurrentStep(2);
    };

    const toPayment = () => {
        const selectedMethod = shippingMethods.find(
            method => method.id === shippingMethodExternal
        );
        setShippingPrice(selectedMethod.price);
        setCurrentStep(3);
        navigate(`/shop/${params.orderId}/checkout/payment`);
    };

    // UPDATE STEPS
    useEffect(() => {
        localStorage.setItem("currentStep", currentStep);
    }, [currentStep]);

    return (
        <div className="flex max-sm:flex-col min-h-[100vh]">
            <div className="md:w-1/2 lg:w-3/5 border-r border-gray-200">
                <div className="px-[30px] pt-[30px]">
                    <div className="flex justify-center pb-4">
                        <img
                            src={logo} alt="alt-logo"
                            className="w-[141px] h-[40]"
                        />
                    </div>
                    {cart.cartItems.length > 0 && (
                        <div className="flex items-center justify-center pb-4">
                            <span className="max-sm:text-[0.85rem]">
                                <Link to={`/cart`} onClick={() => {
                                    handleStepChange(1);
                                    dispatch(toggleCart(false));
                                }}>
                                    {t.checkout.cart[language]}
                                </Link>
                            </span>
                            <img
                                src={forwardImg}
                                alt="alt-forward-to-1"
                                className="max-sm:h-6 md:h-8 lg:h-[30px] max-sm:p-1 md:p-1.5 lg:p-2"
                            />
                            <span className="max-sm:text-[0.85rem]"
                                  onClick={() => {
                                      handleStepChange(1);
                                      setShippingPrice(0.00);
                                      navigate(`/shop/${params.orderId}/checkout/information`);
                                  }}>
                                {t.checkout.information[language]}
                            </span>
                            <img
                                src={forwardImg}
                                alt="alt-forward-to-2"
                                className="max-sm:h-6 md:h-8 lg:h-[30px] max-sm:p-1 md:p-1.5 lg:p-2"
                            />
                            <span
                                className={clsx(
                                    'max-sm:text-[0.85rem]',
                                    currentStep > 1 ? 'text-black' : 'text-gray-500'
                                )}
                                onClick={() => {
                                    if (order && order?.shipping_address?.first_name !== "") {
                                        handleStepChange(2);
                                        navigate(`/shop/${params.orderId}/checkout/shipping`);
                                    }
                                }}>
                                {t.checkout.shipping[language]}
                            </span>
                            <img
                                src={forwardImg}
                                alt="alt-forward-to-3"
                                className="max-sm:h-6 md:h-8 lg:h-[30px] max-sm:p-1 md:p-1.5 lg:p-2"
                            />
                            <span className={clsx(
                                'max-sm:text-[0.85rem]',
                                currentStep > 2 ? "text-black" : "text-gray-500"
                            )}
                                  onClick={() => {
                                      if (order && order?.shipping_method?.shipping_name !== "") {
                                          handleStepChange(3);
                                          navigate(`/shop/${params.orderId}/checkout/payment`);
                                      }
                                  }}>
                                {t.checkout.payment[language]}
                            </span>
                        </div>
                    )}
                </div>
                {cart.cartItems.length > 0 && (
                    <div className="max-sm:px-[10px] md:px-[20px] lg:px-[30px] max-sm:pt-5 lg:pt-[50px] pb-[10px]">
                        {
                            currentStep === 1
                            &&
                            <>
                                <ShippingAddressForm
                                    initialValue={addressFormObject}
                                    shippingAddresses={shippingAddresses}
                                    usernameEmail={usernameEmail}
                                    orderId={params.orderId}
                                    countries={countries}
                                    phoneCodes={phoneCodes}
                                    provinces={provinces}
                                    submit={handleSubmitShippingAddressForm}
                                    setCurrentStep={handleStepChange}
                                    setShippingAddressString={setShippingAddressString}
                                />
                            </>
                        }
                        {
                            currentStep === 2
                            &&
                            <>
                                <div className="order-info">
                                    <h3>{t.checkout.shippingInfo[language]}</h3>
                                    {
                                        token?.access ? (
                                            <div>
                                                <span>EMAIL:</span>
                                                <span className="max-sm:w-1/2">{usernameEmail}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <span>EMAIL:</span>
                                                <span className="max-sm:w-1/2">{order?.shipping_address?.email}</span>
                                            </div>
                                        )
                                    }
                                    <div className="flex justify-between">
                                        <span>{t.checkout.shippingAddress[language]}</span>
                                        <span className="max-sm:w-1/2">{shippingAddressString}</span>
                                    </div>
                                </div>
                                <ShippingMethodForm
                                    initialValue={shippingMethods}
                                    orderId={params.orderId}
                                    setShippingPrice={setShippingPrice}
                                    setShippingMethodExternal={setShippingMethodExternal}
                                    submit={toPayment}
                                    setCurrentStep={handleStepChange}
                                />
                            </>

                        }
                        {
                            currentStep === 3
                            &&
                            <>
                                <div className="order-info">
                                    <h3>{t.checkout.shippingInfo[language]}</h3>
                                    {
                                        token?.access ? (
                                            <div>
                                                <span>EMAIL:</span>
                                                <span className="max-sm:w-1/2">{usernameEmail}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <span>EMAIL:</span>
                                                <span className="max-sm:w-1/2">{order?.shipping_address?.email}</span>
                                            </div>
                                        )
                                    }
                                    <div>
                                        <span>{t.checkout.shippingAddress[language]}</span>
                                        <span className="max-sm:w-1/2">{shippingAddressString}</span>
                                    </div>
                                    <div>
                                        <span>{t.checkout.shippingMethod[language]}</span>
                                        <span className="max-sm:w-1/2">{order?.shipping_method?.shipping_name}</span>
                                    </div>
                                </div>
                                <PaymentForm orderId={params.orderId}/>
                            </>
                        }
                    </div>
                )}
            </div>
            {
                cart.cartItems.length > 0 ? (
                    <div className="max-sm:w-full md:w-1/2 lg:w-2/5">
                        <div>
                            <CheckoutItems cart={cart}/>
                        </div>
                        <div className="flex flex-col justify-between p-6 border-b-gray-200 border-b-[1px]">
                            <div className="checkout-fees">
                            <span>{t.checkout.subtotal[language]}</span>
                                <span>{cart.totalPrice}
                                    <span>{t.shop.price[language]}</span></span>
                            </div>
                            <div className="checkout-shipping">
                                <span>{t.checkout.shippingMethod[language]}:</span>
                                {
                                    order?.shipping_method?.id !== undefined
                                        ? (
                                            <span>{parseFloat(order?.shipping_method?.price) === 0.00
                                                ? "Free"
                                                : parseFloat(shippingPrice || order.shipping_method.price)}
                                                <span>{t.shop.price[language]}</span></span>
                                        ) : (
                                            <span>{parseFloat(shippingPrice).toFixed(2)}
                                                <span>{t.shop.price[language]}</span></span>
                                        )
                                }

                            </div>
                        </div>
                        <div className="flex justify-between p-6">
                            <span>{t.checkout.total[language]}</span>
                            {
                                order?.shipping_method?.id !== undefined
                                    ? (
                                        <span>{(parseFloat(cart.totalPrice) + parseFloat(shippingPrice || order.shipping_method.price)).toFixed(2)}
                                            <span>{t.shop.price[language]}</span></span>
                                    ) : (
                                        <span>{(parseFloat(shippingPrice) + parseFloat(cart.totalPrice)).toFixed(2)}
                                            <span>{t.shop.price[language]}</span></span>
                                    )
                            }
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
                            <h3>{t.stuff.loading[language]}</h3>
                        </span>
                    </div>
                )
            }
        </div>
    )
};

export default Checkout;