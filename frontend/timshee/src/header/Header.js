import Logo from "./Logo";
import Navigation from "./Navigation";
import Info from "./Info";

// import "./Header.css";
import "./Header2.css";
import "../main/Main.css"
import React, {useEffect, useState} from "react";

import logo from "../media/static_images/logo.png";
import burger from "../media/static_images/burger-menu.svg";
import {useDispatch, useSelector} from "react-redux";
import {getCartItems} from "../main/cart/api/asyncThunks";
import {closeCart, toggleCart, toggleMenu} from "../redux/slices/menuSlice";
import {resetIsAdded} from "../main/cart/reducers/cartSlice";
import {Link, useNavigate} from "react-router-dom";
import AuthService from "../main/api/authService";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = AuthService.getCurrentUser();
    const {collections, categories} = useSelector(state => state.app);
    const {cart, getCartItemsStatus} = useSelector(state => state.cart);
    const {genders} = useSelector(state => state.shop);
    const [menuOpen, setMenuOpen] = useState(false);

    // RESIZE AND HIDE MENU
    useEffect(() => {
        const hideBurgerMenu = () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        }

        window.addEventListener("resize", hideBurgerMenu);

        return () => window.removeEventListener("resize", hideBurgerMenu);
    }, []);

    useEffect(() => {
        if (getCartItemsStatus === "idle") {
            dispatch(getCartItems());
        }

    }, [getCartItemsStatus, cart.cartItems.length]);

    const handleCart = () => {
        if (
            document.location.pathname === "/checkout" ||
            document.location.pathname === "/cart"
        ) {
            dispatch(closeCart());
        } else if (window.innerWidth <= 768) {
            navigate("/cart");
        } else {
            dispatch(toggleCart());
            dispatch(resetIsAdded());
        }
    };

    const burgerMenuButton = () => {
        return <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={burger} alt="alt-burger-menu" height={20}/>
        </div>
    };

    const navLeft = () => {
        return <nav className="nav nav-left">
            <ul className="nav-list-lvl0">
                <li className="nav-item-lvl0">
                    <span>Shop</span>
                    <ul className="nav-list-lvl1">
                        <li className="nav-item-lvl1">
                            <span>
                                <Link to={`/shop/collections/${collections[0].link}`}>
                                    {collections[0].name}
                                </Link>
                            </span>
                            <ul className="nav-list-lvl2">
                                <li  className="nav-item-lvl2"
                                onClick={() => setMenuOpen(false)}>
                                    <span>
                                        <Link to={`/shop/collections/${genders[0].value}+${collections[0].link}`}>women</Link>
                                    </span>
                                    <ul className="nav-list-lvl3">
                                        {categories.map((category, index) => (
                                            <li className="nav-item-lvl3" key={index}>
                                                <span>{category.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="nav-item-lvl2"
                                onClick={() => setMenuOpen(false)}><span>
                                    <Link to={`/shop/collections/${genders[1].value}+${collections[0].link}`}>men</Link>
                                </span></li>
                            </ul>
                        </li>
                        <li className="nav-item-lvl1"
                        onClick={() => setMenuOpen(false)}><span>women</span></li>
                        <li className="nav-item-lvl1"
                        onClick={() => setMenuOpen(false)}><span>men</span></li>
                    </ul>
                </li>
                <li className="nav-item-lvl0">
                    <span>Collections</span>
                    <ul className="nav-list-lvl1">
                        {collections.map((collection, index) => (
                            <li className="nav-item-lvl1" key={index}
                            onClick={() => setMenuOpen(false)}>
                                <span>
                                    <Link to={`/shop/collections/${collection.link}`}>
                                        {collection.name}
                                    </Link>
                                </span>
                            </li>
                        ))}
                    </ul>
                </li>
                <li className="nav-item-lvl0"
                onClick={() => setMenuOpen(false)}><span>The house</span></li>
                <li className="nav-item-lvl0"
                onClick={() => setMenuOpen(false)}><span>About</span></li>
            </ul>
        </nav>
    };

    const navRight = () => {
        return <nav className="nav nav-right">
            <ul className="nav-list-lvl0">
                <li className="nav-item-lvl0">
                    <span>Ship to</span>
                </li>
                <li className="nav-item-lvl0">
                    <span>Account</span>
                    {
                        token?.access ? (
                            <ul className="nav-list-lvl1">
                                <li className="nav-item-lvl1"
                                onClick={() => setMenuOpen(false)}>
                                    <span><Link to="/account/details">Details</Link></span></li>
                                <li className="nav-item-lvl1"
                                onClick={() => setMenuOpen(false)}>
                                    <span><Link to="/account/details/addresses">Address book</Link></span></li>
                                <li className="nav-item-lvl1"
                                onClick={() => setMenuOpen(false)}>
                                    <span><Link to="/account/details/orders">Orders</Link></span></li>
                                <li className="nav-item-lvl1"
                                onClick={() => setMenuOpen(false)}>
                                    <span>WishList</span></li>
                            </ul>
                        ) : (
                            <ul className="nav-list-lvl1">
                                <li className="nav-item-lvl1">
                                    <span><Link to="/account/login"
                                    onClick={() => setMenuOpen(false)}>Login</Link></span></li>
                                <li className="nav-item-lvl1">
                                    <span><Link to="/account/register"
                                    onClick={() => setMenuOpen(false)}>Register</Link></span></li>
                            </ul>
                        )
                    }
                </li>
                <li className="nav-item-lvl0" onClick={handleCart}>
                    <span>Cart ({cart.totalQuantityInCart || 0})</span>
                </li>
            </ul>
        </nav>
    };

    const navRightEmpty = () => {
        return <nav className="nav nav-empty">

        </nav>
    };

    const logoCenter = () => {
        return <div className="logo">
            <Link to="/">
                <img src={logo} alt="alt-logo" height={35}/>
            </Link>
        </div>
    };

    const burgerMenu = () => {
        return (
            <div className="nav-burger-menu">
                {navLeft()}
                {navRight()}
            </div>
        )
    }


    return (
        <div className="header-container">
            <header className={`header ${menuOpen ? "show-nav" : ""}`}>
                {burgerMenuButton()}
                {menuOpen && burgerMenu()}
                {!menuOpen && navLeft()}
                {logoCenter()}
                {!menuOpen && navRight()}
                {navRightEmpty()}
            </header>
        </div>
    );
}

export default Header;