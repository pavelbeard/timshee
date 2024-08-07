import React, {useEffect} from 'react';
import {useSelector} from "react-redux";

import Header from "../header/Header";
import Content from "./Content";
import Footer from "../footer/Footer";

import "./Main.css";
import EditAddressForm from "./account/pages/addresses/forms/EditAddressForm";
import Cart from "./cart/pages/Cart";
import ChangeEmailForm from "./account/pages/forms/ChangeEmailForm";


const Main = () => {
    window.document.title = "Timshee";

    const isSearchClicked = useSelector(state => state.search.isActive);
    const isSideMenuClicked = useSelector(state => state.menu.isActive);
    const {isChangeEmailClicked} = useSelector(state => state.menu);
    const isAddressFormOpened = useSelector(state => state.accountData.isAddressFormOpened);
    const isCartClicked = useSelector(state => state.menu.isCartClicked);

    useEffect(() => {
        if (isSearchClicked || isSideMenuClicked || isCartClicked || isAddressFormOpened || isChangeEmailClicked) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => document.body.style.overflow = "auto";
    }, [isSearchClicked, isSideMenuClicked, isAddressFormOpened, isCartClicked, isChangeEmailClicked]);

    return (
        <div className="main">
            <Header />
            <Content />
            <Footer />
            {isAddressFormOpened && <EditAddressForm />}
            {isChangeEmailClicked && <ChangeEmailForm />}
            {isCartClicked && <Cart />}
        </div>
    )
}

export default Main;