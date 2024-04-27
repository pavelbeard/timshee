import React from "react";
import {useDispatch} from "react-redux";
import {toggleMenuLvl1} from "../redux/slices/menuLvl1Slice";
import {Link} from "react-router-dom";

import "./Navigation.css";

const NavList = ({styleMode}) => {
    const dispatch = useDispatch();

    const enterMenuLvl1 = () => {
        dispatch(toggleMenuLvl1());
    }

    return (
        <ul className={styleMode ? "nav-list" : "nav-list nav-list-another"}>
            <li className="nav-item" onMouseEnter={enterMenuLvl1} onMouseOut={enterMenuLvl1}>
                <Link to="/shop">Shop</Link>
            </li>
            <li className="nav-item">
                <Link to="/collections">Collections</Link>
            </li>
            <li className="nav-item">The house</li>
            <li className="nav-item">About</li>
        </ul>
    )
}

export default NavList;