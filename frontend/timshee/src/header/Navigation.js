import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux"
import {toggleMenu} from "../redux/slices/menuSlice";
import NavList from "./NavList";

import "../main/Main.css";
import "./Navigation.css";
import burgerMenu from "../media/static_images/burger-menu.svg";

const Navigation = () => {

    const dispatch = useDispatch();
    const [isWindowNotWide, setIsWindowNotWide] = React.useState(false);

    const clickSideMenu = () => {
        dispatch(toggleMenu());
    }

    useEffect(() => {
        const showBurgerMenu = () => {
            const width = window.innerWidth;
            const tmp = width < 768;
            setIsWindowNotWide(tmp);
        }

        showBurgerMenu();
        window.addEventListener("resize", showBurgerMenu);

        return () => window.removeEventListener("resize", showBurgerMenu);
    }, []);


    return (
        <nav className="nav nav-left">
            {
                isWindowNotWide ? (
                    <img src={burgerMenu} alt="bg-menu" height={20} onClick={clickSideMenu}/>
                ) : (
                    <NavList styleMode={!isWindowNotWide}/>
                )
            }
        </nav>
    )
}

export default Navigation;