import React, {useEffect, useRef} from "react";
import search from "../media/static_images/buscador.svg";
import {toggleSearch} from "../redux/slices/searchSlice";
import {useDispatch, useSelector} from "react-redux";

import "./Info.css";
import "./Navigation.css";
import AccountBar from "./AccountBar";
import {toggleCart} from "../redux/slices/menuSlice";
import {getQuantityOfCart} from "../redux/slices/shopSlices/itemSlice";
import {Link} from "react-router-dom";

const InfoList = ({ itIsPartOfSideMenu }) => {
    const dispatch = useDispatch();
    const hideTimer = useRef(null);
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {hasDeleted, quantityOfCart} = useSelector(state => state.item);
    const {isAdded} = useSelector(state => state.cart);

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
        dispatch(getQuantityOfCart({isAuthenticated}));

    }, [isAuthenticated, isAdded, hasDeleted, quantityOfCart]);

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
                if(document.location.pathname !== "/cart") {
                    dispatch(toggleCart());
                }
            }}>Cart ({quantityOfCart || 0})
                <Link to="/cart"></Link>
            </li>
        </ul>
    )
};

export default InfoList;