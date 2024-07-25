import React from "react";
import {clsx} from "clsx";

const collNameStyle = clsx(
    "flex flex-col items-center tracking-widest",
    "max-sm:text-xl max-sm:p-2",
    "md:text-2xl md:p-4",
    "lg:text-3xl lg:p-6",
);

export default function ShopHeader(props) {
    const { error, params, path } = props
    return (
        <div className={collNameStyle}>

            {error ? <div className="text-red-500">{error}</div> :
                path().at(1)?.replaceAll('-', ' ').replace(/(\d{4}) (\d{4})/, "$1/$2") || params.c.split('+')[0]}
        </div>
    )
}