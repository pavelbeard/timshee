import NavLeft from "./nav-left";
import Logo from "./logo";
import NavRight from "./nav-right";
import React from "react";

export default function HeaderXl(props) {
    const {
        genders, collections, categories, toggleCartMenu, toggleBurgerMenu,
        wishlist, totalQuantityInCart, isVerified, isRefreshed, token,
        nav, ul, borderIfScreenBefore1280
    } = props;
    return(
        // XL
        <header className="max-sm:hidden md:hidden xl:flex justify-center py-5" data-header-xl="">
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