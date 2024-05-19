import React, {useEffect, useState} from 'react';

import "./Checkout.css";
import ShippingAddressForm from "./forms/ShippingAddressForm";
import {useDispatch, useSelector} from "react-redux";
import {closeCart} from "../../redux/slices/menuSlice";
import {getCountries, getPhoneCodes, getProvinces, getShippingAddress} from "../../redux/slices/shopSlices/orderSlice";

// STATUS_CHOICES = (
//         ('created', 'CREATED'),
//         ('pending_for_pay', 'PENDING FOR PAY'),
//         ('processing', 'PROCESSING'),
//         ('completed', 'COMPLETED'),
//         ('cancelled', 'CANCELLED'),
//     )

const Checkout = () => {
    window.document.title = 'Timshee | Checkout';

    const dispatch = useDispatch();

    const [orderedItems, setOrderedItems] = useState();
    const [primaryShippingAddress, setPrimaryShippingAddress] = useState();

    const {addresses, countries, phoneCodes, provinces} = useSelector(state => state.order);
    const {isAuthenticated} = useSelector(state => state.auth);

    useEffect(() => {
        if (orderedItems === undefined) {
            setOrderedItems(JSON.parse(localStorage.getItem('order')));
            dispatch(getShippingAddress({isAuthenticated}));
            dispatch(getCountries());
            dispatch(getPhoneCodes());
            dispatch(getProvinces());
        }
    }, []);

    return(
        <div className="checkout-container">
            <div className="checkout-shipping-information">
                <div className="checkout-header-navigation">Navigation</div>
                <div className="checkout-contact">Contact</div>
                <div className="checkout-shipping-address">
                    <ShippingAddressForm
                        shippingAddresses={addresses}
                        countries={countries}
                        phoneCodes={phoneCodes}
                        provinces={provinces}
                    />
                </div>
            </div>
            <div className="checkout-items-container">
                <div className="checkout-items">Items</div>
                <div className="checkout-subtotal">Subtotal</div>
                <div className="checkout-total">Total</div>
            </div>
        </div>
    )
};

export default Checkout;