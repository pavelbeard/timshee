import {useShopStore} from "../../../../store";
import {clsx} from "clsx";
import React from "react";
import {useTranslation} from "react-i18next";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";

export default function SizesBlock(props, children) {
    const { t } = useTranslation();
    const { robotoText, blockStyle  } = props;
    const {sizes, uncheckSizes, checkSizes} = useShopStore();
    return (
        <div className={blockStyle}>
            <div className={clsx("filters-reset", "border-gray-200 border-b-[1px]")}>
                <span className={clsx("selected-1", robotoText)}>
                    {t('shop:selected')} ({sizes.filter(size => size.checked).length})
                </span>
                <div className={clsx("reset", robotoText)} onClick={uncheckSizes}>{t('shop:reset')}</div>
            </div>
            <div className={clsx("filters-list",)}>
                {Array.isArray(sizes) && sizes?.map((size) => {
                    return (
                        <label key={size.id} className={clsx('flex items-center')}>
                            <input
                                disabled={size.total === 0}
                                type="checkbox"
                                checked={size.checked}
                                value={size.id}
                                onChange={e => checkSizes(parseInt(e.target.value))}/>
                            <span className={clsx("value-name", robotoText, 'ml-2')}>({size.total}) {size.value}</span>
                        </label>
                    )})
                }
            </div>
        </div>
    )
}
