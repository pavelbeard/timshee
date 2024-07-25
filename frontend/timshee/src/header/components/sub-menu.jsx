import React from "react";
import clsx from "clsx";
import {useWindowSize} from "../../lib/hooks";

export default function SubMenu({ className, children }) {
    const { width } = useWindowSize();
    const ul = clsx(
        'bg-white p-0 flex',
        width <= 640 && 'max-sm:relative max-sm:flex-col',
        width > 640 && width <= 768 && 'sm:relative sm:flex-col ',
        width > 768 && width <= 1024 && 'md:absolute md:flex-row',
        width > 1024 && width <= 1280 && 'lg:absolute lg:flex-row',
        width > 1280 && width <= 1536 && 'xl:absolute xl:flex-row',
    );
    return(
        <ul className={clsx(ul, className)} data-sub-menu={width}>
            {children}
        </ul>
    )
}