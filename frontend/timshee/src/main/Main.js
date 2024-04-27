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


const Main = () => {
    const dispatch = useDispatch();
    const isSearchClicked = useSelector(state => state.search.isActive);
    const isSideMenuClicked = useSelector(state => state.menu.isActive);
    const isEditAddressMenuClicked = useSelector(state => state.menu.isAddressEditFormOpened);

    useEffect(() => {
        dispatch(checkAuthStatus());
        if (isSearchClicked || isSideMenuClicked) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => document.body.style.overflow = "auto";
    }, [isSearchClicked, isSideMenuClicked, isEditAddressMenuClicked]);

    return (
        <div className="main">
            <Header />
            {isSearchClicked && <SideSearch />}
            <Content />
            <Footer />
            {isSideMenuClicked && <SideMenu />}
            {isEditAddressMenuClicked && <EditAddressForm />}
        </div>
    )
}

export default Main;