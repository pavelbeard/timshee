import {clsx} from "clsx";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import React from "react";
import {Link} from "react-router-dom";

export default function ToButton({ to, children, ...rest }) {
    return (
        <Link
            className={clsx(
                'flex w-48 max-sm:w-full items-center justify-start mb-3 cursor-pointer',
                'hover:text-gray-300',
            )}
            to={to}
        >
            <ArrowDownIcon strokeWidth="0.5" className={clsx('size-4 mr-3')}/>
            <span className="roboto-light">
                {children}
            </span>
        </Link>
    )
}