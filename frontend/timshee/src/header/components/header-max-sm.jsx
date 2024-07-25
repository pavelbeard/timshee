import {clsx} from "clsx";
import {XMarkIcon} from "@heroicons/react/24/outline";
import React from "react";
import GroupHeader from "./group-header";

export default function HeaderMaxSm(props) {
    const {
        genders, collections, categories, toggleCartMenu, toggleBurgerMenu,
        wishlist, totalQuantityInCart, isVerified, isRefreshed, token,
        nav, ul, borderIfScreenBefore1280
    } = props;
    const maxSm = clsx(
        "absolute w-full h-[100vh] overflow-y-auto bg-white max-sm:flex max-sm:flex-col items-center max-sm:p-6"
    )
    return (
        // MAX-SM
        <header className={maxSm} data-header-max-sm="">
            <div className="flex w-full items-start">
                <XMarkIcon
                    strokeWidth="0.5"
                    className="size-6 cursor-pointer"
                    onClick={toggleBurgerMenu}
                />
            </div>
            <GroupHeader
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
        </header>
    )
}
