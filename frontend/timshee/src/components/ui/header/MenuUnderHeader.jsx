import {useLocation} from "react-router-dom";
import {clsx} from "clsx";
import MenuUnderHeaderItem from "./MenuUnderHeaderItem";
import {useCategories} from "../../../lib/hooks";
import {useMemo} from "react";

export default function MenuUnderHeader() {
    const updatedCategories = useCategories();
    const { pathname } = useLocation();
    const visible =
        pathname === "/" ||
        pathname.includes("/shop");

    const headerItems = useMemo(() => Array.isArray(updatedCategories)
        && updatedCategories.map((item, index) =>
            <MenuUnderHeaderItem
                key={index}
                item={item}
            />
        ),[updatedCategories]);

    return(
        <nav className={clsx(visible ? "lg:flex justify-center border-gray-200 border-y-[1px]" : 'hidden')}>
            <MenuUnderHeaderItem withoutList={true} />
            {headerItems}
        </nav>
    )
}