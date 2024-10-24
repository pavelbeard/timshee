import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../lib/hooks";
import {
  selectIsFiltersMenuOpen,
  toggleFiltersMenu,
} from "../../../redux/features/store/uiControlsSlice";
import ItemsTotal from "./ItemsTotal";

export default function FiltersAdjustmentsSmallScreen() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isFiltersMenuOpen = useSelector(selectIsFiltersMenuOpen);
  const adjustments = clsx("mr-1", "size-4");
  const adjustmentsText = clsx("roboto-light text-xs mb-[4px]");
  return (
    <div
      className={clsx(
        isFiltersMenuOpen && "w-full",
        "flex justify-between mx-6 my-2 border-1",
      )}
      data-adjustements=""
    >
      <div className="flex items-center">
        <AdjustmentsHorizontalIcon
          strokeWidth="0.5"
          className={adjustments}
          onClick={() => dispatch(toggleFiltersMenu())}
        />
        <span className={adjustmentsText}>{t("shop:filtersAndSort")}</span>
      </div>
      <ItemsTotal className={adjustmentsText} />
    </div>
  );
}
