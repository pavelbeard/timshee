import {clsx} from "clsx";
import React from "react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import GroupHeader from "./group-header";

export default function HeaderMd(props) {
    const {
        genders, collections, categories, toggleCartMenu, toggleBurgerMenu,
        wishlist, totalQuantityInCart, isVerified, isRefreshed, token,
        nav, ul, borderIfScreenBefore1280

    } = props;
    const md = clsx(
        "absolute w-1/2 h-[100vh] overflow-y-auto bg-white md:flex md:flex-col items-center md:p-6"
    )
    return (
        // MD
        <header className={md} data-header-md="">
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
