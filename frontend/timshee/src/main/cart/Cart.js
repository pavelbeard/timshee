import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toggleCart} from "../../redux/slices/menuSlice";

import "../Main.css";
import "./Cart.css";
import close from "../../media/static_images/cruz.svg";
import CartItems from "./CartItems";
import {createOrder as apiCreateOrder} from "./api/index";
import {getCartItems} from "./api/asyncThunks";
import {setOrderId} from "../../redux/slices/shopSlices/orderSlice";

const Cart = () => {
    window.document.title = "Cart | Timshee";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {hasDeleted, hasChanged, cart} = useSelector(state => state.cart);
    const {isCartClicked} = useSelector(state => state.menu);
    const {orderId} = useSelector(state => state.order);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = React.useState(null);
    // const [orderId, setOrderId] = React.useState(undefined);
    const [orderCreated, setOrderCreated] = React.useState(false);

    useEffect(() => {
        if (orderCreated) {
            navigate(`/shop/${orderId}/checkout`);
        }
    }, [orderCreated]);

    const createOrder = async () => {
        const result = await apiCreateOrder({
            totalPrice: cart.totalPrice,
            cartItems: cart.cartItems,
            isAuthenticated,
            setError,
            setIsLoading,
        });

        if ('id' in result) {
            dispatch(setOrderId(result.id));
            setOrderCreated(true);
        }
    };

    useEffect(() => {
        dispatch(getCartItems({isAuthenticated}));
    }, [isAuthenticated, isCartClicked, hasChanged, hasDeleted, orderId]);

    const cartBody = () => {
        return (
            <div className={isCartClicked ? "cart" : "cart cart-wide cart-high cart-empty"}>
                <div className="cart-header">
                    <div>Your cart</div>
                    {isCartClicked && <img src={close} alt="alt-close-cart" height={20} onClick={() => dispatch(toggleCart())}/>}
                </div>
                {typeof cart.cartItems !== "undefined" && cart.cartItems.length > 0
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
                                <div className="cart-checkout" onClick={createOrder}>
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