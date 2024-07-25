import React from 'react';
import Header from "../header/header";
import Content from "./content";
import Footer from "../footer/footer";
import Overlay from "./overlay";
import Cart from "./cart/pages/cart";
import {useWindowSize} from "../lib/hooks";
import {useCartStore, useControlsStore} from "../store";


const Container = () => {
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
                <Overlay width={width} isCartMenuOpen={isCartMenuOpen}>
                    <Cart />
                </Overlay>
            </>
        )
    }
}

function MainContent() {
    return (
        <div className="relative">
            <Header/>
            <Content/>
            <Footer/>

        </div>
    )
}

export default Container;