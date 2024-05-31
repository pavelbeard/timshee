import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toggleCart} from "../../redux/slices/menuSlice";

import "../Main.css";
import "./Cart.css";
import close from "../../media/static_images/cruz.svg";
import CartItems from "./CartItems";
import {getCartItems} from "./api/asyncThunks";

const Cart = () => {
    window.document.title = "Cart | Timshee";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {cart, getCartItemsStatus} = useSelector(state => state.cart);
    const {isCartClicked} = useSelector(state => state.menu);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = React.useState(null);

    const checkout = () => {
        if (cart.cartItems.length > 0) {
            navigate(`/shop/${cart.orderId}/checkout`);
        }
    };

    // WEAK
    useEffect(() => {
        if (getCartItemsStatus === "idle") {
            dispatch(getCartItems());
        }
    }, [getCartItemsStatus, cart.cartItems.length]);

    const cartBody = () => {
        return (
            <div className={isCartClicked ? "cart" : "cart cart-wide cart-high cart-empty"}>
                <div className="cart-header">
                    <div>Your cart</div>
                    {isCartClicked && <img src={close} alt="alt-close-cart" height={20} onClick={() => dispatch(toggleCart())}/>}
                </div>
                {cart.cartItems.length > 0
                    ? (
                        <>
                            <CartItems cart={cart} dispatch={dispatch}/>
                            <div className="cart-footer">
                                <div></div>
                                <div className="terms-and-conditions">
                                    <div>Shipping and taxes calculated at checkout</div>
                                    <label>
                                        <input id="privacy" type="checkbox"/>
                                        <span>I have read the
                                            <Link className="privacy" to="/privacy-information">
                                                Privacy Information Notice
                                            </Link>
                                        </span>
                                    </label>
                                </div>
                                <div className="cart-checkout" onClick={checkout}>
                                        Checkout • {cart.totalPrice}
                                </div>
                            </div>
                        </>

                    ) : (
                        <div className="cart-is-empty">
                            <h1>Cart is empty</h1>
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