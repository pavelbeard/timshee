import {useShopStore} from "../../../store";
import {clsx} from "clsx";
import React from "react";
import {useTranslation} from "react-i18next";

export default function ColorsBlock(props) {
    const { robotoText, blockStyle } = props;
    const { t } = useTranslation();
    const { colors, uncheckColors, checkColors } = useShopStore();
    return (
        <div className={blockStyle}>
            <div className={clsx("filters-reset", "border-gray-200 border-b-[1px]")}>
                <span className={clsx("selected-1", robotoText)}>
                    {t('shop:selected')} ({colors.filter(color => color.checked).length})
                </span>
                <div className={clsx("reset", robotoText)} onClick={uncheckColors}>{t('shop:reset')}</div>
            </div>
            <div className={clsx("filters-list")}>
                {Array.isArray(colors) && colors.map((color) => {
                    return (
                        <label key={color.id} className={clsx('flex items-center')}>
                            <input
                                disabled={color.total === 0}
                                type="checkbox"
                                checked={color.checked}
                                value={color.id}
                                onChange={e => checkColors(parseInt(e.target.value))}/>
                            <span className={clsx("value-name", robotoText, 'ml-2')}>({color.total}) {color.value}</span>
                            <div className={clsx("value-name", robotoText)} style={{backgroundColor: `${color.hex}`}}></div>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}
