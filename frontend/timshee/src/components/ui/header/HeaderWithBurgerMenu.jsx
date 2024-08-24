import {clsx} from "clsx";
import {Bars3Icon} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import React from "react";
import {useDispatch} from "react-redux";
import {toggleBurgerMenu} from "../../../redux/features/store/uiControlsSlice";

export default function HeaderWithBurgerMenu() {
    const dispatch = useDispatch();
    const burgerSlices = clsx(
        'max-sm:size-6',
        'sm:size-6',
        'md:size-8',
        'lg:size-8',
    );
    return (
        <div className="grid grid-cols-3 p-6 items-center">
            <Bars3Icon strokeWidth="0.5" className={burgerSlices} onClick={() => dispatch(toggleBurgerMenu())}/>
            <Logo className="mb-[8px] w-full flex justify-center"/>
            <div></div>
        </div>
    )

}