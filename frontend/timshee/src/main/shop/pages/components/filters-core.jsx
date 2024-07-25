import React, {useState, forwardRef, useImperativeHandle, useEffect} from "react";
import {clsx} from "clsx";
import {useControlsStore, useShopStore} from "../../../../store";
import {useTranslation} from "react-i18next";
import FiltersHeaderSm from "./filters-header-sm";
import FiltersFooterSm from "./filters-footer-sm";
import {useWindowSize} from "../../../../lib/hooks";
import FiltersContainerSm from "./filters-container-sm";
import FiltersContainer from "./filters-container";
import FiltersGroupStock from "./filters-group-stock";
import FiltersOrderBy from "./filters-order-by";
import FilterList from "./filters-list";
import FiltersBodySm from "./filters-body-sm";

const FiltersCore = forwardRef((props, ref) => {
    const { setCurrentPageLink } = props;
    const { itemsObject, filters, sortOrder, updateOrderBy, resetFilters } = useShopStore();
    const {
        isFiltersMenuOpen, toggleFiltersMenu, toggleSizesMenu, toggleColorsMenu, toggleTypesMenu
    } = useControlsStore();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const [orderBy, setOrderBy] = useState("");
    const [activeFilter, setActiveFilter] = useState(null);
    const activeFilterLabels = {
        size: t('shop:size'),
        color: t('shop:color'),
        type: t('shop:type')
    };
    const robotoText = clsx(
        'roboto-light text-sm tracking-widest'
    );
    const turnFilters = (e) => {
        const prohibitedFilters =
            e.target.classList[0] === 'value-name' ||
            e.target.classList[0] === 'selected-1' ||
            e.target.classList[0] === 'filters-list' ||
            e.target.classList[0] === 'filters-container' ||
            e.target.classList[0] ==='filters-reset' ||
            e.target.localName === 'input';
        if (!prohibitedFilters) {
            const filter = e.target.getAttribute("data-filter");
            setActiveFilter(activeFilter === filter ? null : filter);
        }
    }

    useEffect(() => {
        if ( width >= 640 ) {
            toggleFiltersMenu(true);
            toggleSizesMenu(true);
            toggleColorsMenu(true);
            toggleTypesMenu(true);
        }
    }, [width]);

    useImperativeHandle(ref, () => ({
        turnFilters
    }));

    if (isFiltersMenuOpen) {
        return (
            <FiltersContainerSm>
                <FiltersHeaderSm
                    robotoText={robotoText}
                    toggleFiltersMenu={toggleFiltersMenu}
                />
                <FiltersBodySm
                    robotoText={robotoText}
                    turnFilters={turnFilters}
                    activeFilterLabels={activeFilterLabels} />
                <FiltersFooterSm />
            </FiltersContainerSm>
        )
    } else {
        return (
            <>
                <FiltersContainer>
                    <FiltersGroupStock
                        activeFilterLabels={activeFilterLabels}
                        turnFilters={turnFilters}
                        activeFilter={activeFilter}
                        robotoText={robotoText}
                    />
                    <FiltersOrderBy
                        sortOrder={sortOrder}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        updateOrderBy={updateOrderBy}
                        robotoText={robotoText}
                    />
                </FiltersContainer >
                <FilterList
                    filters={filters}
                    resetFilters={resetFilters}
                    setActiveFilter={setActiveFilter}
                    setOrderBy={setOrderBy}
                    setCurrentPageLink={setCurrentPageLink}
                />
            </>
        )
    }



});

export default FiltersCore;