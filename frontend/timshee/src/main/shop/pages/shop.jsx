import React, {useEffect, useState, useRef} from 'react';
import ItemCards from "./components/item-cards";
import {useNavigate, useParams} from "react-router-dom";
import Nothing from "../../techPages/nothing";
import {useControlsStore, useShopStore} from "../../../store";
import Pagination from "./components/pagination";
import ShopHeader from "./components/shop-header";
import FiltersCore from "./components/filters-core";
import Overlay from "../../overlay";
import {useWindowSize} from "../../../lib/hooks";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/24/outline";
import {clsx} from "clsx";
import {useTranslation} from "react-i18next";
import ItemsTotal from "./components/items-total";


export default function Shop() {
    window.document.title = "Shop | Timshee";
    const params = useParams();
    const navigate = useNavigate();
    const controlsRef = useRef(null);
    const navigationEntries = window.performance.getEntriesByType("navigation");
    const {
        error, filters, genders, sortOrder,
        itemsObject, colors, sizes, types,
        collections, categories,
        getSizes, getColors, getTypes, getItems
    } = useShopStore();
    const { isFiltersMenuOpen, toggleFiltersMenu } = useControlsStore();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const [currentPage, setCurrentPage] = useState(1);
    const adjustmentsContainer = clsx(
        'flex w-full justify-between',
        'max-sm:px-6 max-sm:py-2 max-sm:border-1'
    );
    const adjustments = clsx(
        'mr-1',
        'size-4'
    );
    const adjustmentsText = clsx(
        'roboto-light text-xs mb-[4px]'
    )
    const path = () => {
        const values = params.c.split('+');
        const gender = genders.filter(g => values.includes(g.value)).at(0)?.gender || "";
        const collection = collections.filter(c => values.includes(c.link)).at(0)?.link || "";
        const category = categories.filter(c => values.includes(c.code)).at(0)?.code || "";
        const type = types.filter(c => values.includes(c.code)).at(0)?.code || "";

        return [gender, collection, category, type];
    };

    const setCurrentPageLink = (page) => {
        if (page === 0 || page === undefined) {
            setCurrentPage(1);
            navigate(`/shop/collections/${params.c}`);
        } else {
            setCurrentPage(page);
            navigate(`/shop/collections/${params.c}/page/${page}`);
        }
    };


    useEffect(() => {
        if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
            setCurrentPageLink();
        }

        (async () => {
            await getSizes();
            await getColors();
            await getTypes();
            await getTypes();

            if(itemsObject === null) {
                const [gender, collection, category, type] = path();

                await getItems({
                    filters: {
                        gender: gender,
                        collection: collection,
                        category: category,
                        type: [type],
                    },
                    currentPage: currentPage,
                });
            } else if (
                sizes.length > 0 &&
                colors.length > 0 &&
                types.length > 0
            ) {
                const [gender, collection, category] = path();
                const f = {
                    sizes: sizes?.filter(s => s.checked).map(s => s.value),
                    colors: colors?.filter(c => c.checked).map(c => c.value),
                    category: category,
                    orderBy: sortOrder?.filter(so => filters.includes(so.name))[0]?.value,
                    gender: gender,
                    collection: collection,
                    types: types?.filter(t => t.checked).map(t => t.code),
                };

                await getItems({
                    filters: f,
                    currentPage: currentPage,
                });
            }
        })();
    }, []);

    //next/prev page/

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            navigate(`/shop/collections/${params.c}/page/${currentPage - 1}`);
        }
    };

    const nextPage = () => {
        if (currentPage < itemsObject?.pagesCount) {
            setCurrentPage(currentPage + 1);
            navigate(`/shop/collections/${params.c}/page/${currentPage + 1}`);
        }
    };

    const turnFilters = e => {
        if (controlsRef.current) {
            controlsRef.current.turnFilters(e);
        }
    };

    if (itemsObject?.items.length === 0) {
        return <Nothing/>
    } else {
        return (
            <div className="flex flex-col pb-6" onClick={turnFilters}>
                <ShopHeader
                    error={error}
                    params={params}
                    path={path}
                />
                {width <= 639 && <div className={adjustmentsContainer} data-adjustements={width}>
                    <div className="flex items-center">
                        <AdjustmentsHorizontalIcon strokeWidth="0.5" className={adjustments} onClick={() => toggleFiltersMenu()}/>
                        <span className={adjustmentsText}>{t('shop:filtersAndSort')}</span>
                    </div>
                    <ItemsTotal className={adjustmentsText}/>
                </div>}
                {width <=639 && <Overlay isFiltersMenuOpen={isFiltersMenuOpen} >
                    <FiltersCore
                        toggleFiltersMenu={toggleFiltersMenu}
                        isFiltersMenuOpen={isFiltersMenuOpen}
                        setCurrentPageLink={setCurrentPageLink}
                        ref={controlsRef}
                    />
                </Overlay>}
                {width >= 640 && <FiltersCore
                        setCurrentPageLink={setCurrentPageLink}
                        ref={controlsRef}
                />}
                <ItemCards itemsObject={itemsObject}/>
                <Pagination
                    totalPages={itemsObject?.pagesCount || 1}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPageLink}
                    prevPage={prevPage}
                    nextPage={nextPage}
                />
            </div>
        )
    }
}