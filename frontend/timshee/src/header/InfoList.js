import React, {useEffect, useRef} from "react";
import search from "../media/static_images/buscador.svg";
import {toggleSearch} from "../redux/slices/searchSlice";
import {useDispatch, useSelector} from "react-redux";

import "./Info.css";
import "./Navigation.css";
import AccountBar from "./AccountBar";
import {closeCart, toggleCart} from "../redux/slices/menuSlice";
import {Link} from "react-router-dom";
import {getCartItems, resetIsAdded} from "../redux/slices/shopSlices/cartSlice";

const InfoList = ({ itIsPartOfSideMenu }) => {
    const dispatch = useDispatch();
    const hideTimer = useRef(null);
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {hasDeleted, quantityOfCart} = useSelector(state => state.item);
    const {cart, isAdded} = useSelector(state => state.cart);

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
        dispatch(getCartItems({isAuthenticated}));
    }, [isAuthenticated, isAdded, hasDeleted, quantityOfCart, cart.totalQuantityInCart]);

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
            <li className="nav-item" onMouseEnter={showAccountBar} onMouseLeave={hideAccountBar}>
                Account
                {
                    isAccountBarVisible && <AccountBar showAccountBar={showAccountBar} hideAccountBar={hideAccountBar}/>
                }
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