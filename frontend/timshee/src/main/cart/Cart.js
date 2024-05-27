import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toggleCart} from "../../redux/slices/menuSlice";

import "../Main.css";
import "./Cart.css";
import close from "../../media/static_images/cruz.svg";
import {getCartItems} from "../../redux/slices/shopSlices/cartSlice";
import CartItems from "./CartItems";
import {createOrder as apiCreateOrder} from "./api/index";

const Cart = () => {
    window.document.title = "Cart | Timshee";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {hasDeleted, hasChanged} = useSelector(state => state.item);
    const {cart} = useSelector(state => state.cart);
    const {isCartClicked} = useSelector(state => state.menu);

    // const {orderStates, orderId, steps} = useSelector(state => state.order);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = React.useState(null);
    const [orderId, setOrderId] = React.useState(undefined);

    useEffect(() => {
        if (orderId !== undefined) {
            navigate(`/shop/${orderId}/checkout`);
        }
    }, [orderId]);

    const createOrder = async () => {
        const result = await apiCreateOrder({
            totalPrice: cart.totalPrice,
            cartItems: cart.cartItems,
            isAuthenticated,
            setError,
            setIsLoading,
        });

        if ('id' in result) {
            setOrderId(result.id);
        }
    };

    useEffect(() => {
        dispatch(getCartItems({isAuthenticated}));
    }, [isAuthenticated, isCartClicked, hasChanged, hasDeleted]);

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
                            <CartItems data={cart.cartItems} dispatch={dispatch}/>
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