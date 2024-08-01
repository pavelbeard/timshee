import {clsx} from "clsx";
import {XMarkIcon} from "@heroicons/react/24/outline";
import React from "react";
import GroupHeader from "./group-header";

export default function HeaderSmMd(props) {
    const {
        genders, collections, categories, toggleCartMenu, toggleBurgerMenu,
        wishlist, totalQuantityInCart, isVerified, isRefreshed, token,
        nav, ul, borderIfScreenBefore1280
    } = props;
    const smMd = clsx(
        "absolute w-1/2 h-[100vh] overflow-y-auto bg-white",
        "sm:flex sm:flex-col items-center sm:p-6",
        "md:flex md:flex-col items-center md:p-6",
    )
    return (
        // SM-MD
        <header className={smMd} data-header-sm-md="">
            <div className="flex w-full items-start">
                <XMarkIcon
                    strokeWidth="0.5"
                    className="size-8 cursor-pointer"
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
