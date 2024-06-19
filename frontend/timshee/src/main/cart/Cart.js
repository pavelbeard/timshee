import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import {toggleCart} from "../../redux/slices/menuSlice";

import "../Main.css";
import "./Cart.css";
import close from "../../media/static_images/cruz.svg";
import CartItems from "./CartItems";
import {getCartItems} from "./api/asyncThunks";
import translateService from "../translate/TranslateService";
import t from "../translate/TranslateService";

const Cart = () => {
    window.document.title = "Cart | Timshee";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const language = translateService.language();
    const {cart, getCartItemsStatus, clearCartItemStatus, deleteCartItemsStatus} = useSelector(state => state.cart);
    const {isCartClicked} = useSelector(state => state.menu);
    const [isPrivacyHaveRead, setIsPrivacyHaveRead] = React.useState(false);

    const checkout = () => {
        if (cart.cartItems.length > 0 && isPrivacyHaveRead) {
            navigate(`/shop/${cart.orderId}/checkout`);
        }
    };

    // WEAK
    useEffect(() => {
        if (getCartItemsStatus === "idle") {
            dispatch(getCartItems());
        }
    }, [getCartItemsStatus, clearCartItemStatus, deleteCartItemsStatus, cart.cartItems.length]);

    const cartBody = () => {
        return (
            <div className={isCartClicked ? "cart" : "cart cart-wide cart-high cart-empty"}>
                <div className="cart-header">
                    <div>{translateService.cart.yourCart[language]}</div>
                    {isCartClicked && <img src={close} alt="alt-close-cart" height={20} onClick={() => dispatch(toggleCart())}/>}
                </div>
                {cart.cartItems.length > 0
                    ? (
                        <>
                            <CartItems cart={cart} dispatch={dispatch}/>
                            <div className="cart-footer">
                                <div></div>
                                <div className="terms-and-conditions">
                                    <div>{translateService.cart.taxesAndShipping[language]}</div>
                                    <label>
                                        <input id="privacy"
                                               checked={isPrivacyHaveRead}
                                               type="checkbox" onChange={
                                            e => setIsPrivacyHaveRead(e.target.checked)
                                        } />
                                        <span>{translateService.privacy.text[language].split('.')[0]} <Link className="privacy" to={`/privacy-information`}>
                                                <span>{translateService.privacy.text[language].split('.')[1]}</span>
                                            </Link>
                                        </span>
                                    </label>
                                </div>
                                <div className={`cart-checkout ${isPrivacyHaveRead
                                    ? "cart-checkout-enabled" : "cart-checkout-disabled"
                                }`} onClick={checkout}>
                                    {translateService.cart.checkout[language]} • {cart.totalPrice}<span>{t.shop.price[language]}</span>
                                </div>
                            </div>
                        </>

                    ) : (
                        <div className="cart-is-empty">
                            <h1>{translateService.cart.cartIsEmpty[language]}</h1>
                        </div>
                    )
                }

            </div>
        )
    };

    if (!isCartClicked) {
        return cartBody();
    } else {
        return (
            <div className="overlay cart-container">
                <div className="cart-empty-space" onClick={() => dispatch(toggleCart())}></div>
                {cartBody()}
            </div>
        )
    }
};

export default Cart;