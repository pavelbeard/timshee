import {Link, useLocation, useParams} from "react-router-dom";
import MenuFlatLeaf from "./MenuFlatLeaf";
import {clsx} from "clsx";
import UnderlineDynamic from "../UnderlineDynamic";
import {useMemo} from "react";

export default function MenuItemFlat({ item }) {
    const { pathname } = useLocation();
    const underline = useMemo(() => pathname.startsWith(item.url), [pathname])
    return (
        <li className='p-2 relative z-0'>
            {item?.url
                ? <Link className="group text-lg" to={item.url}>
                    {item.title}
                    <UnderlineDynamic underline={underline} />
                </Link>
                : (item?.action && !item?.url) &&
                <button onClick={item?.action} className="text-lg">{item.title}</button>
            }
            {item?.subMenu && <MenuFlatLeaf item={item} />}
        </li>
    )
}