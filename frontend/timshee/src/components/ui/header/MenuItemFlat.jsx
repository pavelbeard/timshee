import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import UnderlineDynamic from "../UnderlineDynamic";
import MenuFlatLeaf from "./MenuFlatLeaf";

export default function MenuItemFlat({ item }) {
  const { pathname } = useLocation();
  const underline = useMemo(() => pathname.startsWith(item.url), [pathname]);
  return (
    <li className="p-2 relative z-0">
      {item?.url ? (
        <Link className="group text-lg" to={item.url}>
          {item.title}
          <UnderlineDynamic underline={underline} />
        </Link>
      ) : (
        item?.action &&
        !item?.url && (
          <button onClick={item?.action} className="text-lg">
            {item.title}
          </button>
        )
      )}
      {item?.subMenu && <MenuFlatLeaf item={item} />}
    </li>
  );
}
