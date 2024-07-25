import React, {useEffect, useState} from "react";

import {useNavigate} from "react-router-dom";
import {clsx} from "clsx";
import {useAuthentication} from "../lib/global/hooks";
import {useCartStore, useGlobalStore, useControlsStore, useShopStore, useWishlistStore} from "../store";
import {useWindowSize} from "../lib/hooks";
import HeaderMd from "./components/header-md";
import HeaderMaxSm from "./components/header-max-sm";
import NarrowHeader from "./components/narrow-header";
import Overlay from "../main/overlay";
import HeaderSm from "./components/header-sm";
import HeaderLg from "./components/header-lg";
import HeaderXl from "./components/header-xl";

const Header = () => {
    const navigate = useNavigate();
    // const {postLanguage} = useContext(TranslateContext);
    const {isVerified, isRefreshed, token} = useAuthentication();
    const { cartItems, totalQuantityInCart, getCartItems } = useCartStore();
    const { genders, collections, categories } = useShopStore();
    const { wishlist, getWishlist } = useWishlistStore();
    const { countries } = useGlobalStore();
    const { isBurgerMenuOpen, toggleBurgerMenu, toggleCartMenu } = useControlsStore();
    const { width } = useWindowSize();

    useEffect(() => {
        (async () => {
            await getWishlist();
            await getCartItems();
            await getWishlist(token);
        })();
    }, []);

    useEffect(() => {
        if ( width >= 1024 ) {
            toggleBurgerMenu(true);
        }
    }, [width]);

    const handleCart = () => {
        if (
            document.location.pathname === "/checkout" ||
            document.location.pathname === "/cart"
        ) {
            toggleCartMenu(true);
        } else if (width <= 768) {
            navigate(`/cart`);
        } else {
            toggleCartMenu();
        }
    };

    const nav = clsx(
        'flex justify-center',
        'max-sm:w-full',
        'sm:w-full',
        'md:w-full',
        'lg:w-1/2',
        'xl:w-1/2',
    );
    const ul = clsx(
        'flex justify-center p-0',
        'max-sm:flex-col max-sm:w-full max-sm:text-center',
        'sm:flex-col sm:w-full sm:text-center',
        'md:flex-col md:w-full md:text-center',
        'lg:flex-row',
        'xl:flex-row',
    );
    const borderIfScreenBefore1280 = clsx(
        'max-sm:border-black max-sm:border-y-2',
        'sm:border-black sm:border-y-2',
        'md:border-black md:border-y-2',
        'lg:border-none',
        'xl:border-none',
    );
    if ( width <= 639 ) {
        console.log('MAX-SM', width)
        if (!isBurgerMenuOpen) {
            return (
                <NarrowHeader toggleBurgerMenu={toggleBurgerMenu} />
            )
        } else {
            return (
                <HeaderMaxSm
                    nav={nav}
                    ul={ul}
                    borderIfScreenBefore1280={borderIfScreenBefore1280}
                    genders={genders}
                    collections={collections}
                    categories={categories}
                    toggleCartMenu={toggleCartMenu}
                    toggleBurgerMenu={toggleBurgerMenu}
                    wishlist={wishlist}
                    totalQuantityInCart={totalQuantityInCart}
                    isVerified={isVerified}
                    isRefreshed={isRefreshed}
                    token={token}
                />
            )
        }
    } else if ( width >= 640 && width <= 767 ) {
        console.log('SM', width)
        if (!isBurgerMenuOpen) {
            return (
                <NarrowHeader toggleBurgerMenu={toggleBurgerMenu} />
            )
        } else {
            return (
                <Overlay isBurgerMenuOpen={isBurgerMenuOpen} >
                    <HeaderSm
                        nav={nav}
                        ul={ul}
                        borderIfScreenBefore1280={borderIfScreenBefore1280}
                        genders={genders}
                        collections={collections}
                        categories={categories}
                        toggleCartMenu={toggleCartMenu}
                        toggleBurgerMenu={toggleBurgerMenu}
                        wishlist={wishlist}
                        totalQuantityInCart={totalQuantityInCart}
                        isVerified={isVerified}
                        isRefreshed={isRefreshed}
                        token={token}
                    />
                </Overlay>
            )
        }
    } else if ( width >= 768 && width <= 1023  ) {
        console.log('MD', width)
        if (!isBurgerMenuOpen) {
            return (
                <NarrowHeader toggleBurgerMenu={toggleBurgerMenu} />
            )
        } else {
            return (
                <Overlay isBurgerMenuOpen={isBurgerMenuOpen} >
                    <HeaderMd
                        nav={nav}
                        ul={ul}
                        borderIfScreenBefore1280={borderIfScreenBefore1280}
                        genders={genders}
                        collections={collections}
                        categories={categories}
                        toggleCartMenu={toggleCartMenu}
                        toggleBurgerMenu={toggleBurgerMenu}
                        wishlist={wishlist}
                        totalQuantityInCart={totalQuantityInCart}
                        isVerified={isVerified}
                        isRefreshed={isRefreshed}
                        token={token}
                    />
                </Overlay>
            )
        }
    } else if ( width >= 1024 && width <= 1279 ) {
        console.log('LG', width)
        return (
            <HeaderLg
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
                genders={genders}
                collections={collections}
                categories={categories}
                toggleCartMenu={toggleCartMenu}
                toggleBurgerMenu={toggleBurgerMenu}
                wishlist={wishlist}
                totalQuantityInCart={totalQuantityInCart}
                isVerified={isVerified}
                isRefreshed={isRefreshed}
                token={token}
            />
        )
    } else if ( width >= 1280 /*&& width <= 1535*/ ) {
        console.log('XL', width)
        return (
            <HeaderXl
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
                genders={genders}
                collections={collections}
                categories={categories}
                toggleCartMenu={toggleCartMenu}
                toggleBurgerMenu={toggleBurgerMenu}
                wishlist={wishlist}
                totalQuantityInCart={totalQuantityInCart}
                isVerified={isVerified}
                isRefreshed={isRefreshed}
                token={token}
            />
        )
    }
}

export default Header;
