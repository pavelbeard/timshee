import {clsx} from "clsx";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import React from "react";
import {Link} from "react-router-dom";

export default function BackButton({ className, children, to }) {
    return (
        <Link
            className={clsx(
                className,
                'flex w-48 max-sm:w-full items-center justify-start mb-3 cursor-pointer',
                'hover:text-gray-300',
            )}
            to={to}
        >
            <ArrowLeftIcon strokeWidth="0.5" className={clsx('size-4 mr-3')}/>
            <span className="roboto-light">
                {children}
            </span>
        </Link>
    )
}