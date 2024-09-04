import {clsx} from "clsx";
import {Bars3Icon, ShoppingCartIcon} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {toggleBurgerMenu} from "../../../redux/features/store/uiControlsSlice";
import {selectTotalQuantity} from "../../../redux/features/store/cartSlice";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

export default function HeaderWithBurgerMenu() {
    const dispatch = useDispatch();
    const totalQuantity = useSelector(selectTotalQuantity);
    const size = clsx(
        'size-6',
        'md:size-8',
    );
    return (
        <div className="grid grid-cols-3 p-6 items-center">
            <Bars3Icon strokeWidth="0.5" className={size} onClick={() => dispatch(toggleBurgerMenu())}/>
            <Logo className="mb-[8px] w-full flex justify-center"/>
            <div className="flex justify-end">
                <Link to={'/cart'}>({totalQuantity})</Link>
                <ShoppingCartIcon strokeWidth="0.5" className={size} />
            </div>
        </div>
    )

}