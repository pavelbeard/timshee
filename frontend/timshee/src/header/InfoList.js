import React, {useEffect, useRef} from "react";
import search from "../media/static_images/buscador.svg";
import {toggleSearch} from "../redux/slices/searchSlice";
import {useDispatch, useSelector} from "react-redux";

import "./Info.css";
import "./Navigation.css";
import AccountBar from "./AccountBar";
import {toggleCart} from "../redux/slices/menuSlice";
import {getQuantityOfCart} from "../redux/slices/shopSlices/itemSlice";

const InfoList = ({ itIsPartOfSideMenu }) => {
    const dispatch = useDispatch();
    const hideTimer = useRef(null);
    const isAuthenticated = useSelector(state => state.auth.isValid);
    const {hasAdded, hasDeleted, quantityOfCart} = useSelector(state => state.item);

    // const [quantityOfCart, setQuantityOfCart] = React.useState(0);
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

    }, [isAuthenticated, hasAdded, hasDeleted, quantityOfCart]);

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
            <li className="nav-item" onClick={() => dispatch(toggleCart())}>Cart ({quantityOfCart})</li>
        </ul>
    )
};

export default InfoList;