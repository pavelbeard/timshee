import ItemsTotal from "./items-total";
import {clsx} from "clsx";
import {ArrowLeftIcon, XMarkIcon} from "@heroicons/react/24/outline";
import React from "react";
import {useTranslation} from "react-i18next";
import {useControlsStore} from "../../../../store";

export default function FiltersHeaderSm(props) {
    const { t } = useTranslation();
    const { robotoText, activeFilterLabel, toggleFiltersMenu } = props;
    return (
        <div>
            <div className="flex justify-between items-center border-b-[1px] border-gray-200" data-narrow-filters-t="">
                <div className="flex items-center">
                    <span className={clsx(robotoText)}>{t('shop:totalItems')}</span>
                    <ItemsTotal className={clsx(robotoText, 'pl-2')}/>
                </div>
                <XMarkIcon strokeWidth="0.5" className="size-4" onClick={() => toggleFiltersMenu()}/>
            </div>
            {activeFilterLabel ?
            <div className="flex items-center h-6" data-narrow-filters-b="">
                <ArrowLeftIcon className="size-4" strokeWidth="0.5" />
                <span className={clsx(robotoText, 'ml-2')}>{activeFilterLabel}</span>
            </div> : <div className="h-6"></div>}
        </div>
    )

}