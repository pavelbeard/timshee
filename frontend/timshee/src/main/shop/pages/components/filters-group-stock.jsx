import {clsx} from "clsx";
import SizesBlock from "./sizes-block";
import ColorsBlock from "./colors-block";
import TypesBlock from "./types-block";
import React from "react";
import {useTranslation} from "react-i18next";

export default function FiltersGroupStock(props){
    const { t } = useTranslation();
    const { activeFilterLabels, turnFilters, activeFilter, robotoText } = props;
    const dataFiltersContainer = clsx(
        'flex',
        'max-sm:flex-col',
    );
    const blockStyle = clsx(
        'absolute bg-white border-gray-300 p-2 border-[1px]',
        'max-sm:w-full z-[16]',
        'md:w-1/4',
        'lg:top-[280px]',
    );
    const filterLabels = clsx(
        'tracking-widest roboto-light text-sm',
        'md:mr-3'
    );
    return (
        <div className={clsx(dataFiltersContainer)} data-group-stock-container="">
            <label className={filterLabels}>{t('shop:filters')}</label>
            <span
                className={clsx(filterLabels, 'w-1/3', 'hover:underline hover:underline-offset-[3px]')}
                data-filter="size"
                onClick={turnFilters}
            >
                {activeFilterLabels.size}
                {activeFilter === "size" &&
                <SizesBlock
                    blockStyle={blockStyle}
                    robotoText={robotoText}
                />}
            </span>
            <span
                className={clsx(filterLabels, 'w-1/3', 'hover:underline hover:underline-offset-[3px]')}
                data-filter="color"
                onClick={turnFilters}
            >
                {activeFilterLabels.color}
                {activeFilter === "color" &&
                <ColorsBlock
                    blockStyle={blockStyle}
                    robotoText={robotoText}
                />}
            </span>
            <span
                className={clsx(filterLabels, 'w-1/3', 'hover:underline hover:underline-offset-[3px]')}
                data-filter="type"
                onClick={turnFilters}
            >
                {activeFilterLabels.type}
                {activeFilter === "type" &&
                    <TypesBlock
                        blockStyle={blockStyle}
                        robotoText={robotoText}
                    />}
            </span>
        </div>
    )
}