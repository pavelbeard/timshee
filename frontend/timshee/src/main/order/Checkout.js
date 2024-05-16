import React, {useEffect, useState} from 'react';

import "./Checkout.css";

// STATUS_CHOICES = (
//         ('created', 'CREATED'),
//         ('pending_for_pay', 'PENDING FOR PAY'),
//         ('processing', 'PROCESSING'),
//         ('completed', 'COMPLETED'),
//         ('cancelled', 'CANCELLED'),
//     )

const Checkout = () => {
    window.document.title = 'Timshee | Checkout';

    const [orderedItems, setOrderedItems] = useState();
    const [primaryShippingAddress, setPrimaryShippingAddress] = useState();

    useEffect(() => {
        if (orderedItems === undefined) {
            setOrderedItems(JSON.parse(localStorage.getItem('order')));
        }

        if (primaryShippingAddress === undefined) {

        }
    }, []);

    return(
        <div className="checkout-container">
            <div className="checkout-shipping-information">
                <div className="checkout-header-navigation">Navigation</div>
                <div className="checkout-contact">Contact</div>
                <div className="checkout-shipping-address">Shipping address</div>
                <div className="checkout-footer-navigation">Navigation</div>
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