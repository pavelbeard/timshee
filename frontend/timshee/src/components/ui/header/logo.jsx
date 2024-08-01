import {clsx} from "clsx";
import {Link} from "react-router-dom";
import logo from "../../../assets/logo.png";
import React from "react";

export default function Logo({ ...rest }) {
    const style = clsx(
        'max-sm:h-[24px] w-[85px]',
        'md:h-[30px] lg:w-[106px]',
        'lg:h-[40px] lg:w-[141px]',
    )
    return (
        <div {...rest}>
            <Link to={`/`}>
                <img
                    src={logo}
                    alt="alt-logo"
                    className={style}
                />
            </Link>
        </div>
    )
}