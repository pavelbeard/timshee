import { clsx } from "clsx";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useCategories } from "../../../lib/hooks";
import { useGetDynamicSettingsQuery } from "../../../redux/features/api/stuffApiSlice";
import MenuUnderHeaderItem from "./MenuUnderHeaderItem";

export default function MenuUnderHeader() {
  const { data: dynamicSettings } = useGetDynamicSettingsQuery();
  const updatedCategories = useCategories();
  const { pathname } = useLocation();
  const visible = useMemo(
    () => pathname === "/" || pathname.includes("/shop"),
    [pathname],
  );

  const renderMenuItem = useCallback(
    (item) => <MenuUnderHeaderItem key={item.id} item={item} />,
    [],
  );
  const headerItems = useMemo(
    () => updatedCategories?.map(renderMenuItem),
    [updatedCategories, renderMenuItem],
  );

  return (
    <nav
      className={clsx(
        visible
          ? "lg:flex justify-center border-gray-200 border-y-[1px]"
          : "hidden",
      )}
    >
      {dynamicSettings?.itemsForGenders && (
        <MenuUnderHeaderItem withoutList={true} />
      )}
      {headerItems}
    </nav>
  );
}
