import {clsx} from "clsx";
import {Link, useParams} from "react-router-dom";
import logo from "../../../assets/logo.png";
import React from "react";
import Image from "../Image";

export default function Logo({ ...rest }) {
    const style = clsx(
        'z-[0] relative',
        'aspect-[16/9] object-cover h-[1.15rem] w-16',
    );
    return (
        <div {...rest}>
            <Link to={'/'}>
                <img
                    src={logo}
                    alt="alt-logo"
                    className={style}
                />
            </Link>
        </div>
    )
}