import React, {useEffect, useRef} from "react";
import search from "../media/static_images/buscador.svg";
import {toggleSearch} from "../redux/slices/searchSlice";
import {useDispatch, useSelector} from "react-redux";

import "./Info.css";
import "./Navigation.css";
import AccountBar from "./AccountBar";

const API_URL = process.env.REACT_APP_API_URL;

const InfoList = ({ itIsPartOfSideMenu }) => {
    const dispatch = useDispatch();
    const hideTimer = useRef(null);

    const [quantityOfCart, setQuantityOfCart] = React.useState(0);
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

    const userId = localStorage.getItem("userId") || null;

    const getQuantityOfCart = async () => {
        if (userId) {
            try {
                const response = await fetch( API_URL + `api/cart/items/${localStorage.getItem("user_id")}` );
                const json = await response.json();
                const quantity = json.reduce((acc, item) => {
                    return acc + item.quantity
                }, 0);
                setQuantityOfCart(quantity);
            } catch (error) {

            }
        } else {
            const quantityOfCartAnonUser = localStorage.getItem("quantity_cart_anon_user");
            setQuantityOfCart(Number(quantityOfCartAnonUser));
        }

    };

    useEffect(() => {
        getQuantityOfCart();
        // const interval = setInterval(() => getQuantityOfCart(), 3000);
    }, []);

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
            <li className="nav-item">Cart ({quantityOfCart})</li>
        </ul>
    )
};

export default InfoList;