import {useLocation} from "react-router-dom";
import {clsx} from "clsx";
import MenuUnderHeaderItem from "./MenuUnderHeaderItem";
import {useCategories} from "../../../lib/hooks";
import {useCallback, useMemo} from "react";

export default function MenuUnderHeader() {
    const updatedCategories = useCategories();
    const { pathname } = useLocation();
    const visible = useMemo(() =>
        pathname === "/" ||
        pathname.includes("/shop"),
        [pathname]
    );

    const renderMenuItem = useCallback((item) => <MenuUnderHeaderItem key={item.id} item={item}/>, []);
    const headerItems = useMemo(() => updatedCategories?.map(renderMenuItem),[updatedCategories, renderMenuItem]);

    return(
        <nav className={clsx(visible ? "lg:flex justify-center border-gray-200 border-y-[1px]" : 'hidden')}>
            <MenuUnderHeaderItem withoutList={true} />
            {headerItems}
        </nav>
    )
}