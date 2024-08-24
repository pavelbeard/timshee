import {clsx} from "clsx";
import {PlusIcon} from "@heroicons/react/24/outline";
import React from "react";

export default function AddButton({ children, onClick }) {
    return (
        <div
            className={clsx(
                'flex w-48 max-sm:w-full items-center justify-start mb-3 cursor-pointer',
                'hover:text-gray-300',
            )}
            onClick={onClick}
        >
            <PlusIcon strokeWidth="0.5" className={clsx('size-4 mr-3')}/>
            <span className="roboto-light">
                {children}
            </span>
        </div>
    )
}