import {clsx} from "clsx";
import {Bars3Icon} from "@heroicons/react/24/outline";
import Logo from "./logo";
import React from "react";

export default function NarrowHeader(props) {
    const { toggleBurgerMenu } = props;
    const burgerSlices = clsx(
        'max-sm:size-6',
        'sm:size-6',
        'md:size-8',
        'lg:size-8',
    );
    return (
        <div className="grid grid-cols-3 p-6 items-center">
            <Bars3Icon strokeWidth="0.5" className={burgerSlices} onClick={() => toggleBurgerMenu()}/>
            <Logo className="mb-[8px] w-full flex justify-center"/>
            <div></div>
        </div>
    )
}