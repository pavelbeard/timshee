import {useEffect, useRef, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {clsx} from "clsx";

export default function MenuItemRecursive({ item }) {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    };

    const titleStyle = {
        link: clsx("block", item?.roboto && 'roboto-light text-lg'),
        div: clsx("w-full"),
        both: clsx(
            !item?.roboto && "text-2xl tracking-widest",
            "text-center",
            "border-gray-200",
            item?.close && 'border-b-[2px]',
        ),
        disabled: 'bg-gray-100 text-gray-500 roboto-light text-lg',
    };
    const ulStyle = clsx(
    )
    const liStyle = {
        both: clsx('lg:py-0.5 lg:pr-2')
    };
    const underline = pathname.startsWith(item?.url);
    const menu = item?.url
            ? <Link
                className={clsx(titleStyle.link, titleStyle.both, liStyle.both, underline && 'bg-sky-50')}
                to={item.url}
                replace={true}
                onClick={item?.closeMenu}
            >
                {item.title}
            </Link>
            // : <div onClick={toggleOpen} className={clsx(
            //     titleStyle.div, titleStyle.both, liStyle.both, item.disabled && titleStyle.disabled
            // )}>{item.title}</div>;
            : !item.disabled && <div onClick={toggleOpen} className={clsx(
                        titleStyle.div, titleStyle.both, liStyle.both, item.disabled && titleStyle.disabled
                    )}>{item.title}</div>;

    const subMenu = isOpen && Array.isArray(item?.subMenu) &&
            <ul className={clsx(ulStyle)} data-sub-menu="">
                {item?.subMenu.map((item, index) => <MenuItemRecursive key={index} item={item}/>)}
            </ul>

    return (
        <li data-menu-item="">
        {menu}
        {subMenu}
        </li>
    )
}