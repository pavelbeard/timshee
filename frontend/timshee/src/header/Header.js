import Logo from "./Logo";
import Navigation from "./Navigation";
import Info from "./Info";
import AccountBar from "./AccountBar";

import "./Header.css";
import "../main/Main.css"
import {useSelector} from "react-redux";
import MenuLvl1 from "./MenuLvl1";
import React from "react";

const Header = () => {
    const isCursorEnteredLvl1 = useSelector(state => state.menuLvl1.isActive);


    return (
        <div className="header-container">
            <header className="header">
                <Navigation/>
                <Logo/>
                <Info/>
            </header>
            {isCursorEnteredLvl1 && <MenuLvl1 />}
        </div>
    );
}

export default Header;