import {AdjustmentsHorizontalIcon} from "@heroicons/react/24/outline";
import {selectIsFiltersMenuOpen, toggleFiltersMenu} from "../../../redux/features/store/uiControlsSlice";
import ItemsTotal from "./ItemsTotal";
import React from "react";
import {clsx} from "clsx";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

export default function FiltersAdjustmentsSmallScreen() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isFiltersMenuOpen = useSelector(selectIsFiltersMenuOpen);
    const adjustments = clsx(
        'mr-1',
        'size-4'
    );
    const adjustmentsText = clsx(
        'roboto-light text-xs mb-[4px]'
    );
    return(
        <div className={clsx(
            isFiltersMenuOpen && 'w-full',
            "flex justify-between mx-6 my-2 border-1"
        )} data-adjustements="">
            <div className="flex items-center">
                <AdjustmentsHorizontalIcon
                    strokeWidth="0.5"
                    className={adjustments}
                    onClick={() => dispatch(toggleFiltersMenu())}
                />
                <span className={adjustmentsText}>{t('shop:filtersAndSort')}</span>
            </div>
            <ItemsTotal className={adjustmentsText}/>
        </div>
    )
}