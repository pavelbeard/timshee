import React, {useEffect, useState, useRef} from 'react';
import {useControlsStore, useShopStore} from "../../store";
import {useNavigate, useParams} from "react-router-dom";
import {useShopFilters, useWindowSize} from "../../lib/hooks";
import {getItems} from "../../lib/shop";
import {useQuery} from "react-query";
import {clsx} from "clsx";
import Error from "../Error"
import Loading from "../Loading";
import Nothing from "../Nothing";
import ItemCards from "../../components/shop/ItemCards";
import Pagination from "../../components/ui/shop/Pagination";
import ShopHeader from "../../components/ui/shop/ShopHeader";
import FiltersCore from "../../components/ui/shop/filters-core";
import ItemsTotal from "../../components/ui/shop/ItemsTotal";
import ShopHeaderSkeleton from "../../components/skeletons/shop/shop-header-skeleton";
import Modal from "../../components/layout/Modal";
import {useTranslation} from "react-i18next";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/24/outline";
import {shallow} from "zustand/shallow";
import {fetchItems} from "./lib";


export default function Shop() {
    window.document.title = "Shop | Timshee";
    const params = useParams();
    const navigate = useNavigate();
    const controlsRef = useRef(null);
    const navigationEntries = window.performance.getEntriesByType("navigation");
    const {
        filters, sortOrder,
        sizes, colors, types, itemsObject,
    } = useShopStore(s =>({
        filters: s?.filters || [], sortOrder: s?.sortOrder || [],
        sizes: s?.sizes || [], colors: s?.colors || [], types: s?.types || [],
        itemsObject: s?.itemsObject || null,
    }), shallow);
    const {gender, collection, category, type} = useShopFilters();
    const { isLoading, data, error } = useQuery({
        queryKey: ['items'],
        queryFn: async () => await fetchItems({
            itemsObject,
            gender,
            collection,
            category,
            type,
            sizes,
            colors,
            types,
            filters,
            sortOrder,
            currentPage
        })
    });
    const { isFiltersMenuOpen, toggleFiltersMenu } = useControlsStore();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const [currentPage, setCurrentPage] = useState(1);

    //styles
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
    );

    useEffect(() => {
        if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
            setCurrentPageLink();
        }

        if (data) {
            useShopStore.setState({itemsObject: data});
        }
    }, [data]);

    const setCurrentPageLink = (page) => {
        if (page === 0 || page === undefined) {
            setCurrentPage(1);
            navigate(`/shop/collections/${params.c}`);
        } else {
            setCurrentPage(page);
            navigate(`/shop/collections/${params.c}/page/${page}`);
        }
    };
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

    if (isLoading) {
        return <Loading />
    } else if (itemsObject?.items?.length > 0) {
        return (
            <div className="flex flex-col pb-6" onClick={turnFilters}>
                <ShopHeader
                    error={error}
                    params={params}
                />
                {width <= 639 && <div className={adjustmentsContainer} data-adjustements={width}>
                    <div className="flex items-center">
                        <AdjustmentsHorizontalIcon strokeWidth="0.5" className={adjustments} onClick={() => toggleFiltersMenu()}/>
                        <span className={adjustmentsText}>{t('shop:filtersAndSort')}</span>
                    </div>
                    <ItemsTotal className={adjustmentsText}/>
                </div>}
                {width <=639 && <Modal isFiltersMenuOpen={isFiltersMenuOpen} >
                    <FiltersCore
                        toggleFiltersMenu={toggleFiltersMenu}
                        isFiltersMenuOpen={isFiltersMenuOpen}
                        setCurrentPageLink={setCurrentPageLink}
                        ref={controlsRef}
                    />
                </Modal>}
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
    } else if (error) {
        return <Error />;
    } else {
        return <Nothing />
    }
}