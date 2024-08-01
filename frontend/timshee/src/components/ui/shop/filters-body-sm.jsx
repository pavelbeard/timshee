import {useTranslation} from "react-i18next";
import {clsx} from "clsx";
import {useControlsStore, useShopStore} from "../../../store";
import SizesBlock from "./SizesBlock";
import ColorsBlock from "./ColorsBlock";
import TypesBlock from "./TypesBlock";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import React from "react";

export default function FiltersBodySm(props) {
    const { robotoText, activeFilterLabels } = props;
    const [activeFilter, setActiveFilter] = React.useState(false);
    const hover = clsx(
        'hover:underline hover:underline-offset-4'
    );
    const {
        isSizesMenuOpen, toggleSizesMenu,
        isColorsMenuOpen, toggleColorsMenu,
        isTypesMenuOpen, toggleTypesMenu,
    } = useControlsStore();
    const blockStyle = clsx()

    if (isSizesMenuOpen) {
        return <div>
            <ActiveFilterLabel
                activeFilterLabel={activeFilter}
                robotoText={robotoText}
                cb={toggleSizesMenu}
                setActiveFilter={setActiveFilter}/>
            <SizesBlock robotoText={robotoText} blockStyle={blockStyle} />
        </div>
    } else if (isColorsMenuOpen) {
        return <div>
            <ActiveFilterLabel
                activeFilterLabel={activeFilter}
                robotoText={robotoText}
                cb={toggleColorsMenu}
                setActiveFilter={setActiveFilter}/>
            <ColorsBlock robotoText={robotoText} blockStyle={blockStyle} />
        </div>
    } else if (isTypesMenuOpen) {
        return <div>
            <ActiveFilterLabel
                activeFilterLabel={activeFilter}
                robotoText={robotoText}
                cb={toggleTypesMenu}
                setActiveFilter={setActiveFilter}/>
            <TypesBlock robotoText={robotoText} blockStyle={blockStyle} />
        </div>
    } else {
        return(
            <div className="flex flex-col" data-filters-body-sm={activeFilter}>
                <ActiveFilterLabel activeFilterLabel={activeFilter} />
                <div className="flex flex-col">
                    <span
                        className={clsx(robotoText, hover)}
                        onClick={e => {
                            toggleSizesMenu();
                            setActiveFilter(e.target.getAttribute('data-filter'));
                        }}
                        data-filter="size"
                    >
                        {activeFilterLabels.size}
                    </span>
                    <span
                        className={clsx(robotoText, hover)}
                        onClick={e => {
                            toggleColorsMenu();
                            setActiveFilter(e.target.getAttribute('data-filter'));
                        }}
                        data-filter="color"
                    >
                        {activeFilterLabels.color}
                    </span>
                    <span
                        className={clsx(robotoText, hover)}
                        onClick={e => {
                            toggleTypesMenu();
                            setActiveFilter(e.target.getAttribute('data-filter'));
                        }}
                        data-filter="type"
                    >
                        {activeFilterLabels.type}
                    </span>
                </div>
            </div>

        )
    }
}

function ActiveFilterLabel(props) {
    const { t } = useTranslation();
    const { activeFilterLabel, setActiveFilter, robotoText, cb } = props;
    if (activeFilterLabel) {
        return (
            <div className="flex items-center h-6" data-filters-body-b="" onClick={() => {
                setActiveFilter("");
                cb();
            }}>
                <ArrowLeftIcon className="size-4" strokeWidth="0.5"/>
                <span className={clsx(robotoText, 'ml-2')}>{t(`shop:${activeFilterLabel}`)}</span>
            </div>
        )
    }
    return (
        <div className="h-6"></div>
    )
}