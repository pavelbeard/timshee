import {Link, useLocation} from "react-router-dom";
import {clsx} from "clsx";

export default function MenuItemRecursive({ level, item, openMenus, setOpenMenus }) {
    const { pathname } = useLocation();
    // here is compare current opened item.code and incoming item.code
    const showDialog = openMenus[level] === item?.code;
    // open any menu on the same level closing others in the same level
    const toggleMenu = () => {
        setOpenMenus(item?.code, level);
    };

    const titleStyle = {
        link: clsx("block", item?.roboto && 'roboto-light text-lg'),
        div: clsx("w-full", showDialog && item?.subMenu && "bg-blue-50"),
        both: clsx(
            'py-1',
            !item?.roboto && "text-2xl tracking-widest",
            "text-center",
            "border-gray-200",
            item?.close && 'border-b-[2px]',
        ),
        disabled: 'bg-gray-100 text-gray-500 roboto-light text-lg',
    };
    const ulStyle = clsx();
    const liStyle = {
        both: clsx('lg:py-0.5 lg:pr-2')
    };
    // managing of underline
    const underline = pathname.startsWith(item?.url);
    const menu = item?.url
        ? <Link
            className={clsx(titleStyle.link, titleStyle.both, liStyle.both, underline && 'bg-sky-50')}
            to={item.url}
            replace={true}
            onClick={item?.closeMenu || item?.openByFirstClick && toggleMenu}
        >
            {item.title}
        </Link>
        : <button onClick={toggleMenu} className={clsx(
            titleStyle.div, titleStyle.both, liStyle.both, item.disabled && titleStyle.disabled
        )}>
            {item.title}
        </button>;

    const subMenu = showDialog && Array.isArray(item?.subMenu) &&
            <ul className={clsx(ulStyle)} data-sub-menu="">
                {item?.subMenu.map((item, index) => <MenuItemRecursive
                    level={level + 1}
                    key={index}
                    item={item}
                    openMenus={openMenus}
                    setOpenMenus={setOpenMenus}
                />)}
            </ul>

    return (
        <li data-menu-item={item?.title}>
            {menu}
            {subMenu}
        </li>
    )
}