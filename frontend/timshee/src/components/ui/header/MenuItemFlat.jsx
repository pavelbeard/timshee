import {Link, useLocation, useParams} from "react-router-dom";
import MenuFlatLeaf from "./MenuFlatLeaf";
import {clsx} from "clsx";
import UnderlineDynamic from "../UnderlineDynamic";

export default function MenuItemFlat({ item }) {
    const { pathname } = useLocation();
    const underline = pathname.startsWith(item.url);
    return (
        <li className={clsx("p-2")}>
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