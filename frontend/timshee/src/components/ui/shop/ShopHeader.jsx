import React from "react";
import {clsx} from "clsx";

export default function ShopHeader(props) {
    const { error, params } = props;
    const collNameStyle = clsx(
        "flex flex-col items-center tracking-widest",
        "max-sm:text-xl max-sm:p-2 max-sm:w-84 max-sm:h-10",
        "md:text-2xl md:p-4",
        "lg:text-3xl lg:p-6",
    );
    return (
        <div className={collNameStyle}>

            {error?.message ? <div className="text-red-500">{error?.message}</div> :
                params?.collection?.replaceAll('-', ' ').replace(/(\d{4}) (\d{4})/, "$1/$2") || params?.gender}
        </div>
    )
}