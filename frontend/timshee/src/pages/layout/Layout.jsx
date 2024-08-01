import React from 'react';
import Header from "../../components/Header";
import Content from "../../components/layout/Content";
import Footer from "../../components/Footer";
import Modal from "../../components/layout/Modal";
import Cart from "../cart/Cart";
import {useWindowSize} from "../../lib/hooks";
import {useCartStore, useControlsStore} from "../../store";
import RequireAuth from "../../providers/RequireAuth";
import ShopProvider from "../../providers/ShopProvider";
import FilterProvider from "../../providers/FilterProvider";
import AuthenticationProvider from "../../providers/AuthenticationProvider";


const Layout = () => {
    window.document.title = "Timshee";
    const { width } = useWindowSize();
    const { isBurgerMenuOpen, isFiltersMenuOpen, isCartMenuOpen } = useControlsStore();

    const changeOverlay = () => {
        if (isCartMenuOpen || isBurgerMenuOpen || isFiltersMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    changeOverlay();


    // MAX-SM
    if (width <= 639) {
        return(
            <>
                {isCartMenuOpen ? <Cart /> : <MainContent />}
            </>
        )
    // MD, LG, XL >
    } else if ( width >= 640 /*&& width <= 1535*/ ) {
        return (
            <>
                <MainContent />
                <Modal width={width} isCartMenuOpen={isCartMenuOpen}>
                    <Cart />
                </Modal>
            </>
        )
    }
}

function MainContent() {
    return (
        <div className="relative">
            <ShopProvider>
                <FilterProvider>
                    <Header/>
                    <Content/>
                    <Footer/>
                </FilterProvider>
            </ShopProvider>
        </div>
    )
}

export default Layout;