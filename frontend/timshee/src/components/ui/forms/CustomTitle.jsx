import React from "react";
import {clsx} from "clsx";

const h1 = clsx(
    'pb-3',
    'max-sm:text-lg',
    'md:text-xl',
    'lg:text-2xl',
    'flex flex-col'
);

export default function CustomTitle({ title, className }) {
    return (
        <div >
            <h1 className={clsx(h1, className)}>{title}</h1>
        </div>

    )
}