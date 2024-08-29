import MenuLeftRecursive from "./MenuLeftRecursive";
import MenuRightRecursive from "./MenuRightRecursive";
import {XMarkIcon} from "@heroicons/react/24/outline";
import React from "react";
import {clsx} from "clsx";
import {useMenuLeft} from "../../../lib/hooks";

export default function VerticalHeader({ onClose }) {
    const verticalMenuStyle = clsx(
        "flex flex-col items-center z-150",
    );
    const verticalHeader = clsx(
        "pb-6 flex flex-col bg-white h-screen overflow-y-auto md:w-1/2",
    );
    return(
        <header className={verticalHeader} onClick={e => e.stopPropagation()} data-vertical-header="">
            <div className="relative">
                <div className="flex w-full z-150 items-start p-6">
                    <XMarkIcon
                        strokeWidth="0.5"
                        className="size-8 cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                <MenuLeftRecursive className={clsx(verticalMenuStyle)} />
                <MenuRightRecursive className={clsx(verticalMenuStyle)} />
            </div>
        </header>
    )
}