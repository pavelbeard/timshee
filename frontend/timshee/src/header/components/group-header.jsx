import NavLeft from "./nav-left";
import NavRight from "./nav-right";
import React from "react";

export default function GroupHeader(props) {
    const {
        genders, collections, categories, toggleCartMenu, toggleBurgerMenu,
        wishlist, totalQuantityInCart, isVerified, isRefreshed, token,
        nav, ul, borderIfScreenBefore1280
    } = props;
    return(
        <>
            <NavLeft
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
                genders={genders}
                collections={collections}
                categories={categories}
            />
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
        </>
    )
}