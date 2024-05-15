import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {toggleMenuLvl1} from "../redux/slices/menuLvl1Slice";
import {Link} from "react-router-dom";

import "./Navigation.css";
import {toggleMenu} from "../redux/slices/menuSlice";

const NavList = ({styleMode}) => {
    const dispatch = useDispatch();
    const {isActive} = useSelector(state => state.menu)

    const enterMenuLvl1 = () => {
        dispatch(toggleMenuLvl1());
    };

    const ifScreenThinToggleMenu = () => {
        if (window.innerWidth <= 768) {
            dispatch(toggleMenu());
        }
    }

    return (
        <ul className={styleMode ? "nav-list" : "nav-list nav-list-another"}>
            <li className="nav-item" onMouseEnter={enterMenuLvl1} onMouseOut={enterMenuLvl1}>
                <Link to="/shop" onClick={ifScreenThinToggleMenu}>Shop</Link>
            </li>
            <li className="nav-item">
                <Link to="/collections" onClick={ifScreenThinToggleMenu}>Collections</Link>
            </li>
            <li className="nav-item">
                <Link to="/the-house" onClick={ifScreenThinToggleMenu}>The house</Link>
            </li>
            <li className="nav-item">
                <Link to="/about" onClick={ifScreenThinToggleMenu}>About</Link>
            </li>
        </ul>
    )
}

export default NavList;