import FilterBlockSm from "./FilterBlockSm";
import {useTranslation} from "react-i18next";
import {Fragment} from "react";
import {useSelector} from "react-redux";
import Checkboxes from "./Checkboxes";
import {useResetFilters} from "../../../lib/hooks";
import FiltersSelectContainerSm from "./FiltersSelectContainerSm";

export default function FiltersGroupSm() {
    const { sizes, colors, types, collections, categories } = useSelector(s => s.store);
    const { t } = useTranslation();
    const { openBlock, selectedLength } = useSelector(s => s.store);
    const reset = useResetFilters();

    const filtersData = {
        sizes: {
            title: t('shop:size'),
            data: <Checkboxes data={sizes} htmlFor={'value'} labelTextKey={'value'} category={'sizes'} idKey={'value'} />,
            reset: reset.sizes,
            length: selectedLength.sizes,
        },
        colors: {
            title: t('shop:color'),
            data: <Checkboxes data={colors} htmlFor={'hex'} labelTextKey={'name'} category={'colors'} idKey={'hex'} />,
            reset: reset.colors,
            length: selectedLength.colors,
        },
        types: {
            title: t('shop:type'),
            data: <Checkboxes data={types} htmlFor={'code'} labelTextKey={'name'} category={'types'} idKey={'code'} />,
            reset: reset.types,
            length: selectedLength.types,
        },
        collections: {
            title: t('shop:collection'),
            data: <Checkboxes data={collections} htmlFor={'link'} labelTextKey={'name'} category={'collections'} idKey={'link'} />,
            reset: reset.collections,
            length: selectedLength.collections,
        },
        categories: {
            title: t('shop:category'),
            data: <Checkboxes data={categories} htmlFor={'code'} labelTextKey={'name'} category={'categories'} idKey={'code'} />,
            reset: reset.categories,
            length: selectedLength.categories,
        },
        orderBy: {
            title: t('shop:orderBy'),
            data: <FiltersSelectContainerSm />,
            reset: reset.orderBy,
            length: selectedLength.orderBy,
        }
    };

    return(
        <div className="h-full flex flex-col items-start pl-2 my-2">
            {Object.keys(filtersData).map((key, index) => (
                <Fragment key={index}>
                    {(openBlock === null || openBlock === key) &&
                        <FilterBlockSm
                            tag={key}
                            reset={filtersData[key].reset}
                            title={filtersData[key].title}
                            selected={filtersData[key].length}
                        >
                            {filtersData[key].data}
                        </FilterBlockSm>
                    }
                </Fragment>
            ))}
        </div>
    )
}