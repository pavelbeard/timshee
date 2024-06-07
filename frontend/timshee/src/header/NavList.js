import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

import "./Navigation.css";
import {
    toggleCollectionsIsTouched,
    toggleMenu,
    toggleMenuLvl1,
    toggleMenuLvl2,
    toggleShopIsTouched
} from "../redux/slices/menuSlice";

const NavList = ({styleMode}) => {
    const dispatch = useDispatch();
    const {
        shopIsTouched, collectionsIsTouched,
        isMenuLvl1Active, isMenuLvl2Active
    } = useSelector(state => state.menu);
    const {collections, categories} = useSelector(state => state.app);
    const {genders} = useSelector(state => state.shop);
    const ifScreenThinToggleMenu = () => {
        if (window.innerWidth <= 768) {
            dispatch(toggleMenu());
        }
    }

    return (
        <ul className={styleMode ? "nav-list" : "nav-list nav-list-another"}>
            <li className="nav-item">
                <div onClick={ifScreenThinToggleMenu}
                    onMouseEnter={() => {
                        dispatch(toggleMenuLvl1());
                        dispatch(toggleShopIsTouched());
                    }}
                    onMouseLeave={() => {
                        dispatch(toggleMenuLvl1());
                        dispatch(toggleShopIsTouched());
                    }}>
                    <span>Shop</span>
                    {
                        // lvl1
                        (isMenuLvl1Active && shopIsTouched) && (
                            <ul className="submenu direction-flat">
                                <li className="submenu-item"
                                    onMouseEnter={() => dispatch(toggleMenuLvl2())}
                                    onMouseLeave={() => dispatch(toggleMenuLvl2())}>
                                    <Link to={`/shop/collections/c/${collections[0].link}`}> {collections[0].name}</Link>
                                    {
                                        (isMenuLvl2Active && shopIsTouched) && (
                                            <ul className="submenu">
                                                <li className="submenu-item">
                                                    <Link>KEK</Link>
                                                </li>
                                            </ul>
                                        )
                                    }
                                </li>
                                <li className="submenu-item"
                                    onMouseEnter={() => dispatch(toggleMenuLvl2())}
                                    onMouseLeave={() => dispatch(toggleMenuLvl2())}>
                                    <Link to={`/shop/collections/g/${genders[0].value}`}>women</Link>
                                </li>
                                <li className="submenu-item"
                                    onMouseEnter={() => dispatch(toggleMenuLvl2())}
                                    onMouseLeave={() => dispatch(toggleMenuLvl2())}>
                                    <Link to={`/shop/collections/g/${genders[1].value}`}>man</Link>
                                </li>
                            </ul>
                        )
                    }
                </div>
            </li>
            <li className="nav-item">
                <span onClick={ifScreenThinToggleMenu}
                    onMouseEnter={() => {
                        dispatch(toggleMenuLvl1());
                        dispatch(toggleCollectionsIsTouched());
                    }}
                    onMouseLeave={() => {
                        dispatch(toggleMenuLvl1());
                        dispatch(toggleCollectionsIsTouched());
                    }}>
                    <span>Collections</span>
                    {
                        (isMenuLvl1Active && collectionsIsTouched) && (
                            <ul className="submenu direction-flat">
                                {
                                    collections.map((item, index) => (
                                        <li className="submenu-item" key={index}
                                            onMouseEnter={() => dispatch(toggleMenuLvl2())}
                                            onMouseLeave={() => dispatch(toggleMenuLvl2())}>
                                            <Link to={`/collections/${item.link}`}>
                                                <span>{item.name}</span>
                                            </Link>
                                            {
                                                (isMenuLvl2Active && collectionsIsTouched) && (
                                                        <ul className="submenu">
                                                            <li className="submenu-item">
                                                                KEK
                                                            </li>
                                                        </ul>
                                                    )
                                                }
                                        </li>
                                    ))
                                }
                            </ul>
                        )
                    }
                </span>
            </li>
            <li className="nav-item">
                <div>
                    <Link to="/the-house" onClick={ifScreenThinToggleMenu}>The house</Link>
                </div>
            </li>
            <li className="nav-item">
                <div>
                    <Link to="/about" onClick={ifScreenThinToggleMenu}>About</Link>
                </div>
            </li>
        </ul>
    )
}

export default NavList;