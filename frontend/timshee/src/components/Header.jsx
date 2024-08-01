import React, {useEffect} from "react";

import {useNavigate} from "react-router-dom";
import {clsx} from "clsx";
import {useCartStore, useControlsStore, useShopStore, useWishlistStore} from "../store";
import {useRefreshToken, useWindowSize} from "../lib/hooks";
import HeaderMaxSm from "./ui/header/header-max-sm";
import NarrowHeader from "./ui/header/narrow-header";
import Modal from "./layout/Modal";
import HeaderSmMd from "./ui/header/header-sm-md";
import HeaderLgXl from "./ui/header/header-lg-xl";

import {useQuery} from "react-query";
import {getWishlist} from "../lib/wishlist";
import {getCartItems} from "../lib/cart";

const Header = () => {
    const navigate = useNavigate();
    // const {postLanguage} = useContext(TranslateContext);
    const cartItems = useCartStore(state => state?.cartItems);
    const refreshToken = useRefreshToken();
    const totalQuantityInCart = useCartStore(state => state?.totalQuantityInCart);
    const collections = useShopStore(state => state?.collections);
    const categories = useShopStore(state => state?.categories);
    const wishlist = useWishlistStore(state => state?.wishlist);
    const { isLoading, data, error } = useQuery({
        queryKey: ['header.counters'],
        queryFn: async () => {
            const [wishlist, cartData] = await Promise.all([
                getWishlist(),
                getCartItems(),
            ]);

            const cartItems = cartData.data;
            const totalQuantityInCart = cartData.total_quantity;
            const totalPrice = cartData.total_price;
            const orderId = cartData.order_id;

            return { wishlist, cartItems, totalQuantityInCart, totalPrice, orderId };
        }
    })

    const { isBurgerMenuOpen, toggleBurgerMenu, toggleCartMenu } = useControlsStore();
    const { width } = useWindowSize();

    useEffect(() => {
        (async () => {
            try {
                await refreshToken();
            } catch (e) {

            }
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
                    collections={collections}
                    categories={categories}
                    toggleCartMenu={toggleCartMenu}
                    toggleBurgerMenu={toggleBurgerMenu}
                    wishlist={wishlist}
                    totalQuantityInCart={totalQuantityInCart}
                />
            )
        }
    } else if ( width >= 640 && width <= 1023 ) {
        if (!isBurgerMenuOpen) {
            return (
                <NarrowHeader toggleBurgerMenu={toggleBurgerMenu} />
            )
        } else {
            return (
                <Modal isBurgerMenuOpen={isBurgerMenuOpen} >
                    <HeaderSmMd
                        nav={nav}
                        ul={ul}
                        borderIfScreenBefore1280={borderIfScreenBefore1280}
                        collections={collections}
                        categories={categories}
                        toggleCartMenu={toggleCartMenu}
                        toggleBurgerMenu={toggleBurgerMenu}
                        wishlist={wishlist}
                        totalQuantityInCart={totalQuantityInCart}
                    />
                </Modal>
            )
        }
    } else if ( width >= 1024) {
        return (
            <HeaderLgXl
                nav={nav}
                ul={ul}
                borderIfScreenBefore1280={borderIfScreenBefore1280}
                collections={collections}
                categories={categories}
                toggleCartMenu={toggleCartMenu}
                toggleBurgerMenu={toggleBurgerMenu}
                wishlist={wishlist}
                totalQuantityInCart={totalQuantityInCart}
            />
        )
    }
}

export default Header;
