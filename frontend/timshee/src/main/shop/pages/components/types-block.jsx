import {useShopStore} from "../../../../store";
import {clsx} from "clsx";
import React from "react";
import {useTranslation} from "react-i18next";

export default function TypesBlock(props) {
    const { robotoText, blockStyle } = props;
    const { t } = useTranslation();
    const { types, uncheckTypes, checkTypes } = useShopStore();
    return (
        <div className={blockStyle}>
            <div className={clsx("filters-reset", "border-gray-200 border-b-[1px]")}>
                <span className={clsx("selected-1", robotoText)}>
                    {t('shop:selected')} ({types.filter(types => types.checked).length})
                </span>
                <div className={clsx("reset", robotoText)} onClick={uncheckTypes}>{t('shop:reset')}</div>
            </div>
            <div className={clsx("filters-list")}>
                {Array.isArray(types) && types?.map((type) => {
                    return (
                        <label key={type.id} className={clsx('flex items-center')}>
                            <input
                                disabled={type.total === 0}
                                type="checkbox"
                                checked={type.checked}
                                value={type.id}
                                onChange={e => checkTypes(parseInt(e.target.value))}/>
                            <span className={clsx("value-name", robotoText, 'ml-2')}>({type.total}) {type.value}</span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}
