import "./Header2.css";
import "../main/Main.css"
import React, {useContext, useEffect, useState} from "react";

import logo from "../media/static_images/logo.png";
import burger from "../media/static_images/burger-menu.svg";
import {useDispatch, useSelector} from "react-redux";
import {getCartItems} from "../main/cart/api/asyncThunks";
import {closeCart, toggleCart} from "../redux/slices/menuSlice";
import {resetIsAdded} from "../main/cart/reducers/cartSlice";
import {Link, useNavigate, useParams} from "react-router-dom";
import AuthService from "../main/api/authService";
import {getWishlist} from "../main/account/api/reducers/asyncThunks";
import t from "../main/translate/TranslateService";
import TranslateContext from "../main/translate/TranslateProvider";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = AuthService.getCurrentUser();
    const language = t.language();
    const {postLanguage} = useContext(TranslateContext);
    const {collections, categories, countries, continents} = useSelector(state => state.app);
    const {cart, getCartItemsStatus} = useSelector(state => state.cart);
    const {genders} = useSelector(state => state.shop);
    const {wishlist} = useSelector(state => state.wishlist);
    const [menuOpen, setMenuOpen] = useState(false);

    const [lvl1open, setLvl1open] = useState(false);
    const [lvl2open, setLvl2open] = useState(false);
    const [lvl3open, setLvl3open] = useState(false);

    // RESIZE AND HIDE MENU
    useEffect(() => {
        const hideBurgerMenu = () => {
            if (window.innerWidth > 934) {
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

    useEffect(() => {
        dispatch(getWishlist({token}));
    }, [])

    const handleCart = () => {
        if (
            document.location.pathname === "/checkout" ||
            document.location.pathname === "/cart"
        ) {
            dispatch(closeCart());
        } else if (window.innerWidth <= 768) {
            navigate(`/cart`);
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
                    <span>{t.shop.shop[language]}</span>
                    <ul className="nav-list-lvl1"
                        onMouseEnter={() => setLvl1open(true)}
                        onMouseLeave={() => setLvl1open(false)}
                    >
                        <li className="nav-item-lvl1">
                            <span>
                                <Link to={`/shop/collections/${collections[0].link}`}>
                                    {collections[0].name}
                                </Link>
                            </span>
                            <ul className="nav-list-lvl2"
                                onMouseEnter={() => setLvl2open(true)}
                                onMouseLeave={() => setLvl2open(false)}
                            >
                                <li className="nav-item-lvl2"
                                    onClick={() => setMenuOpen(false)}>
                                    <span>
                                        <Link to={`/shop/collections/${genders[0].value}+${collections[0].link}`}>{
                                            t.shop.women[language]
                                        }</Link>
                                    </span>
                                    <ul className="nav-list-lvl3"
                                        onMouseEnter={() => setLvl3open(true)}
                                        onMouseLeave={() => setLvl3open(false)}
                                    >
                                        {categories.map((category, index) => {
                                            const linkTo = `/shop/collections/${genders[0].value}+${collections[0].link}`
                                                + `+${category.code}`
                                            return (
                                                <li className="nav-item-lvl3" key={index}>
                                                    <span>
                                                        <Link to={linkTo}>{category.name}</Link>
                                                    </span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                                <li className="nav-item-lvl2"
                                    onMouseEnter={() => setLvl2open(true)}
                                    onMouseLeave={() => setLvl2open(false)}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <span>
                                        <Link
                                            to={`/shop/collections/${genders[1].value}+${collections[0].link}`}>{
                                            t.shop.men[language]
                                        }</Link>
                                    </span>
                                    <ul className="nav-list-lvl3"
                                        onMouseEnter={() => setLvl3open(true)}
                                        onMouseLeave={() => setLvl3open(false)}
                                    >
                                        {categories.map((category, index) => {
                                            const linkTo = `/shop/collections/${genders[1].value}+${collections[0].link}`
                                                + `+${category.code}`
                                            return (
                                                <li className="nav-item-lvl3" key={index}>
                                                <span>
                                                    <Link to={linkTo}>{category.name}</Link>
                                                </span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item-lvl1"
                            onClick={() => setMenuOpen(false)}>
                            <span>
                                <Link to={`/shop/collections/${genders[0].value}`}>{t.shop.women[language]}</Link>
                            </span>
                            <ul className="nav-list-lvl2">
                                {collections.map((collection, index) => (
                                    <li className="nav-item-lvl2" key={index}
                                        onClick={() => setMenuOpen(false)}>
                                        <span>
                                            <Link to={`/shop/collections/${genders[0].value}+${collection.link}`}>
                                                {collection.name}
                                            </Link>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item-lvl1"
                            onClick={() => setMenuOpen(false)}>
                            <span>
                                <Link to={`/shop/collections/${genders[1].value}`}>{t.shop.men[language]}</Link>
                            </span>
                            <ul className="nav-list-lvl2"
                                onMouseEnter={() => setLvl2open(true)}
                                onMouseLeave={() => setLvl2open(false)}
                            >
                                {collections.map((collection, index) => (
                                    <li className="nav-item-lvl2" key={index}
                                        onClick={() => setMenuOpen(false)}>
                                        <span>
                                            <Link to={`/shop/collections/${genders[1].value}+${collection.link}`}>
                                                {collection.name}
                                            </Link>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="nav-item-lvl0">
                <span>{t.shop.collections[language]}</span>
                    <ul className="nav-list-lvl1"
                        onMouseEnter={() => setLvl1open(true)}
                        onMouseLeave={() => setLvl1open(false)}
                    >
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
                onClick={() => setMenuOpen(false)}><span>{t.shop.house[language]}</span></li>
                <li className="nav-item-lvl0"
                onClick={() => setMenuOpen(false)}><span>{t.shop.about[language]}</span></li>
            </ul>
        </nav>
    };

    const navRight = () => {
        return <nav className="nav nav-right">
            <ul className="nav-list-lvl0">
                <li className="nav-item-lvl0">
                    <span>{t.shop.changeLanguage[language]}</span>
                    <ul className="nav-list-lvl1"
                        onMouseEnter={() => setLvl1open(true)}
                        onMouseLeave={() => setLvl1open(false)}
                    >
                        {continents.map((continent, index) => (
                            <li className="nav-item-lvl1" key={index}>
                                <span>
                                    {continent.name}
                                </span>
                                <ul className="nav-list-lvl2"
                                    onMouseEnter={() => setLvl2open(true)}
                                    onMouseLeave={() => setLvl2open(false)}
                                >
                                    {countries.map((country, index) => {
                                        if (country.continent.id !== continent.id) {
                                            return <div key={index + 10}></div>
                                        }
                                        return (
                                            <li className="nav-item-lvl2" key={index + 10}
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    postLanguage(country.language);
                                                }}>
                                                <span>
                                                    {country.name}
                                                </span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </li>
                <li className="nav-item-lvl0">
                    <span>{t.shop.account[language]}</span>
                    {
                        token?.access ? (
                            <ul className="nav-list-lvl1"
                                onMouseEnter={() => setLvl1open(true)}
                                onMouseLeave={() => setLvl1open(false)}
                            >
                                <li className="nav-item-lvl1"
                                    onClick={() => setMenuOpen(false)}>
                                    <span><Link to={`/account/details`}>{t.shop.details[language]}</Link></span></li>
                                <li className="nav-item-lvl1"
                                    onClick={() => setMenuOpen(false)}>
                                    <span><Link to={`/account/details/addresses`}>{t.shop.addressBook[language]}</Link></span>
                                </li>
                                <li className="nav-item-lvl1"
                                    onClick={() => setMenuOpen(false)}>
                                    <span><Link to={`/account/details/orders`}>{t.shop.orders[language]}</Link></span>
                                </li>
                                <li className="nav-item-lvl1"
                                    onClick={() => setMenuOpen(false)}>
                                    <span>
                                        <Link to={`/account/details/wishlist`}>
                                            <span>{t.shop.wishlist[language]} <span>({wishlist.length})</span></span>
                                        </Link>
                                    </span>
                                </li>
                            </ul>
                        ) : (
                            <ul className="nav-list-lvl1"
                                onMouseEnter={() => setLvl1open(true)}
                                onMouseLeave={() => setLvl1open(false)}
                            >
                                <li className="nav-item-lvl1">
                                    <span><Link to={`/account/login`}
                                                onClick={() => setMenuOpen(false)}>{t.authForms.login[language]}</Link></span>
                                </li>
                                <li className="nav-item-lvl1">
                                    <span><Link to={`/account/register`}
                                                onClick={() => setMenuOpen(false)}>{t.authForms.register[language]}</Link></span>
                                </li>
                                <li className="nav-item-lvl1"
                                    onClick={() => setMenuOpen(false)}>
                                    <span>
                                        <Link to={`/account/details/wishlist`}>
                                            <span>{t.shop.wishlist[language]} <span>({wishlist.length})</span></span>
                                        </Link>
                                    </span>
                                </li>
                            </ul>
                        )
                    }
                </li>
                <li className="nav-item-lvl0" onClick={() => {
                    setMenuOpen(false);
                    handleCart();
                }}>
                    <span>{t.shop.cart[language]} <span>({cart.totalQuantityInCart || 0})</span> </span>
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
            <Link to={``}>
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

    const navBackground = () => (
        <div className={`nav-background 
        ${lvl1open && "height-50"} 
        ${lvl2open && "height-100"} 
        ${lvl3open && "height-150"}`
        }></div>
    )


    return (
        <>
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
            {navBackground()}
        </>
    );
}

export default Header;