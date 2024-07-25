import {clsx} from "clsx";
import React from "react";
import {useTranslation} from "react-i18next";

export default function FilterList(props) {
    const { t } = useTranslation();
    const { filters, resetFilters, setActiveFilter, setOrderBy, setCurrentPageLink } = props;
    const filtersList = clsx(
        'flex',
        'max-sm:px-[20px] max-sm:text-xs',
        'md:py-[3.5px] md:px-[60px] md:text-lg',
        'lg:text-xl lg:px-10',
    );
    return (
        <div className={clsx(filtersList)} data-filters-list="">
            {Array.isArray(filters) && filters.map((item, index) => (<p className="" key={index}>{item}</p>))}
            {filters.length > 0 &&
                <span className="cursor-pointer underline underline-offset-2 pl-2" onClick={() => {
                    resetFilters();
                    setActiveFilter(null);
                    setOrderBy("");
                    setCurrentPageLink();
                }}
                >
                    {t('shop:reset')}
                </span>
            }
        </div>
    )
}