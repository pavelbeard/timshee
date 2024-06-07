import React, {useEffect, useRef} from "react";
import search from "../media/static_images/buscador.svg";
import {toggleSearch} from "../redux/slices/searchSlice";
import {useDispatch, useSelector} from "react-redux";

import "./Info.css";
import "./Navigation.css";
import AccountBar from "./AccountBar";
import {closeCart, toggleAccountBarIsTouched, toggleCart, toggleMenuLvl1} from "../redux/slices/menuSlice";
import {Link} from "react-router-dom";
import {getCartItems} from "../main/cart/api/asyncThunks";
import {resetIsAdded} from "../main/cart/reducers/cartSlice";
import AuthService from "../main/api/authService";

const InfoList = ({ itIsPartOfSideMenu }) => {
    const dispatch = useDispatch();
    const hideTimer = useRef(null);
    const {cart, getCartItemsStatus} = useSelector(state => state.cart);
    const {isMenuLvl1Active, accountBarIsTouched} = useSelector(state => state.menu);

    const [isAccountBarVisible, setIsAccountBarVisible] = React.useState(false);

    const clickSearch = () => {
        dispatch(toggleSearch());
    };

    const showAccountBar = () => {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
        }
        setIsAccountBarVisible(true)
    };

    const hideAccountBar = () => {
        hideTimer.current = setTimeout(() => {
            setIsAccountBarVisible(false);
        }, 300)
    };

    useEffect(() => {
        if (getCartItemsStatus === "idle") {
            dispatch(getCartItems());
        }
    }, [getCartItemsStatus, cart.cartItems.length]);

    return (
        <ul className={itIsPartOfSideMenu ? "nav-list nav-list-another" : "nav-list"}>
            {
                itIsPartOfSideMenu ? (
                    <></>
                ) : (
                    <li className="search nav-item">
                        <img src={search} alt="search" height={20} onClick={clickSearch}/>
                    </li>
                )
            }
            <li className="nav-item">Ship to</li>
            <li className="nav-item"
                onMouseEnter={() =>{
                    dispatch(toggleMenuLvl1());
                    dispatch(toggleAccountBarIsTouched())
                }}
                onMouseLeave={() => {
                    dispatch(toggleMenuLvl1());
                    dispatch(toggleAccountBarIsTouched());
                }}>
                <div>
                    <span>Account</span>
                    {
                        (isMenuLvl1Active && accountBarIsTouched) &&
                        <AccountBar />
                    }
                </div>

            </li>
            <li className="nav-item" onClick={() => {
                if(
                    document.location.pathname === "/checkout" ||
                    document.location.pathname === "/cart"
                ) {
                    dispatch(closeCart());
                } else {
                    dispatch(toggleCart());
                    dispatch(resetIsAdded());
                }
            }}>Cart ({cart.totalQuantityInCart || 0})
                <Link to="/cart"></Link>
            </li>
        </ul>
    )
};

export default InfoList;