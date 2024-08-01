import React from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/outline";

export default function ShowHideButton({ showHideItems, setShowHideItems, children }) {
    return (
        showHideItems
            ?
            <div
                onClick={() => setShowHideItems(!showHideItems)}
                className="hidden max-sm:flex max-sm:items-center">
                <ChevronDownIcon
                    strokeWidth="0.5"
                    className="max-sm:size-4"
                />
                <span className="roboto-light text-xs max-sm:ml-2">{children}</span>
            </div>
            :
            <div
                onClick={() => setShowHideItems(!showHideItems)}
                className="hidden max-sm:flex max-sm:items-center">
                <ChevronUpIcon
                    strokeWidth="0.5"
                    className="max-sm:size-4"
                />
                <span className="roboto-light text-xs max-sm:ml-2">{children}</span>
            </div>

    )
}