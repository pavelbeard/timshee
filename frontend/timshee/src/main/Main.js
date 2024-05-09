import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import Header from "../header/Header";
import Content from "./Content";
import Footer from "../footer/Footer";
import SideMenu from "../header/SideMenu";

import "./Main.css";
import SideSearch from "../header/SideSearch";
import {checkAuthStatus} from "../redux/slices/checkAuthSlice";
import EditAddressForm from "./account/forms/EditAddressForm";
import Cart from "./cart/Cart";


const Main = () => {
    const dispatch = useDispatch();
    const isSearchClicked = useSelector(state => state.search.isActive);
    const isSideMenuClicked = useSelector(state => state.menu.isActive);
    const isEditAddressMenuClicked = useSelector(state => state.menu.isAddressEditFormOpened);
    const isCartClicked = useSelector(state => state.menu.isCartClicked);

    useEffect(() => {
        dispatch(checkAuthStatus());
        if (isSearchClicked || isSideMenuClicked || isCartClicked) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => document.body.style.overflow = "auto";
    }, [isSearchClicked, isSideMenuClicked, isEditAddressMenuClicked, isCartClicked]);

    return (
        <div className="main">
            <Header />
            {isSearchClicked && <SideSearch />}
            <Content />
            <Footer />
            {isSideMenuClicked && <SideMenu />}
            {isEditAddressMenuClicked && <EditAddressForm />}
            {isCartClicked && <Cart />}
        </div>
    )
}

export default Main;