import React from "react";
import {clsx} from "clsx";
import {useShopFilters} from "../../../lib/hooks";

export default function ShopHeader(props) {
    const { error, params } = props;
    const collNameStyle = clsx(
        "flex flex-col items-center tracking-widest",
        "max-sm:text-xl max-sm:p-2 max-sm:w-84 max-sm:h-10",
        "md:text-2xl md:p-4",
        "lg:text-3xl lg:p-6",
    );
    const { collection } = useShopFilters();
    return (
        <div className={collNameStyle}>

            {error ? <div className="text-red-500">{error}</div> :
                collection?.replaceAll('-', ' ').replace(/(\d{4}) (\d{4})/, "$1/$2") || params.c.split('+')[0]}
        </div>
    )
}