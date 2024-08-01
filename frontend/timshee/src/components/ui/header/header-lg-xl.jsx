import {clsx} from "clsx";
import React from "react";
import NavLeft from "./nav-left";
import Logo from "./logo";
import NavRight from "./nav-right";

export default function HeaderLgXl(props) {
    const {
        toggleCartMenu, toggleBurgerMenu,
        totalQuantityInCart,
        nav, ul, borderIfScreenBefore1280
    } = props;
    const lgXl = clsx(
        "lg:flex lg:justify-between xl:p-6",
        "xl:flex xl:justify-center xl:py-5"
    );
    return(
        // LG-XL
        <header className={lgXl} data-header-lg-xl="">
            <NavLeft
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
            />
            <Logo/>
            <NavRight
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
                toggleCartMenu={toggleCartMenu}
                toggleBurgerMenu={toggleBurgerMenu}
                totalQuantityInCart={totalQuantityInCart}
            />
        </header>
    )
}