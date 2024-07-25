import {clsx} from "clsx";
import React from "react";
import NavLeft from "./nav-left";
import Logo from "./logo";
import NavRight from "./nav-right";

export default function HeaderLg(props) {
    const {
        genders, collections, categories, toggleCartMenu, toggleBurgerMenu,
        wishlist, totalQuantityInCart, isVerified, isRefreshed, token,
        nav, ul, borderIfScreenBefore1280
    } = props;
    const lg = clsx(
        "lg:flex justify-between p-6"
    );
    return(
        // LG
        <header className={lg} data-header-lg="">
            <NavLeft
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
                genders={genders}
                collections={collections}
                categories={categories}
            />
            <Logo/>
            <NavRight
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
                toggleCartMenu={toggleCartMenu}
                toggleBurgerMenu={toggleBurgerMenu}
                wishlist={wishlist}
                totalQuantityInCart={totalQuantityInCart}
                isVerified={isVerified}
                isRefreshed={isRefreshed}
                token={token}
            />
        </header>
    )
}