import React from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/outline";

export default function ShowHideButton({ showHideItems, setShowHideItems, children }) {
    return (
        showHideItems
            ?
            <div
                onClick={() => setShowHideItems(!showHideItems)}
                className="lg:hidden flex items-center mb-4">
                <ChevronDownIcon
                    strokeWidth="0.5"
                    className="size-4"
                />
                <span className="roboto-text ml-2">{children}</span>
            </div>
            :
            <div
                onClick={() => setShowHideItems(!showHideItems)}
                className="lg:hidden flex items-center mb-4">
                <ChevronUpIcon
                    strokeWidth="0.5"
                    className="size-4"
                />
                <span className="roboto-text ml-2">{children}</span>
            </div>

    )
}