import clsx from "clsx";
import {Link} from "react-router-dom";
import React, {useState} from "react";


const li_main = clsx(
    'cursor-pointer list-none',
);

const li_xl = clsx(
    'xl:w-auto xl:text-left',
);

const label_className = clsx(
    "inline-block text-nowrap relative p-2",
)

export default function MenuItem({ label, to=null, type="label", children, ...rest }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <li className={clsx(
            li_main, li_xl
        )}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {type === 'link' ? <Link {...rest} to={to} className={clsx(label_className)}>{label}</Link> :
                type === "label" && <span {...rest} className={clsx(label_className)}>{label}</span>}
            {isOpen && children}
        </li>
    )
}