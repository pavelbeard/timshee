import React, {memo, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useFetchItems, usePagination, useWindowSize} from "../../lib/hooks";
import Error from "../Error"
import Nothing from "../Nothing";
import ItemCards from "../../components/shop/ItemCards";
import Pagination from "../../components/ui/shop/Pagination";
import ShopHeader from "../../components/ui/shop/ShopHeader";
import ItemCardsSkeleton from "../../components/skeletons/shop/ItemCardsSkeleton";
import FiltersAdjustmentsSmallScreen from "../../components/ui/shop/FiltersAdjustmentsSmallScreen";
import FiltersGroupLg from "../../components/ui/shop/FiltersGroupLg";
import FiltersBigScreen from "../../components/ui/shop/FiltersContainerLg";
import SelectedFilters from "../../components/ui/shop/SelectedFilters";
import FiltersSelectContainerLg from "../../components/ui/shop/FiltersSelectContainerLg";
import ItemsTotal from "../../components/ui/shop/ItemsTotal";

const FiltersContainer = memo(({ width }) => (
  <>
    {width <= 768 ? <FiltersAdjustmentsSmallScreen /> : (
      <FiltersBigScreen>
        <FiltersGroupLg />
        <FiltersSelectContainerLg />
        <ItemsTotal className="roboto-text flex justify-end" />
      </FiltersBigScreen>
    )}
    {width > 768 && <SelectedFilters />}
  </>
));

const ConditionalRender = memo(({
   isLoading,
   isSuccess,
   itemsObject,
   error,
   currentPage,
   setCurrentPage,
   prevPage,
   nextPage
}) => (
    <>
        {isLoading && <ItemCardsSkeleton />}
        {isSuccess && itemsObject?.items?.length > 0 && <ItemCards itemsObject={itemsObject} />}
        {isSuccess && itemsObject?.items?.length > 9 && (
          <Pagination
            totalPages={itemsObject?.pagesCount || 1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        )}
        {isSuccess && itemsObject?.items?.length === 0 && <Nothing />}
        {error?.status === 404 && <Error />}
    </>
));


export default function Shop() {
    const params = useParams();
    const { width } = useWindowSize();
    const { applyFilters, itemsObject, isLoading, isSuccess, error } = useFetchItems();
    const [ currentPage, setCurrentPage, prevPage, nextPage ] = usePagination(itemsObject);

    useEffect(() => {
        document.title = "Shop | Timshee";
    }, []);

    useEffect(() => {
        applyFilters('/store/stocks/get_items_detail/?')
    }, [params]);

    return (
        <div className="min-h-screen flex flex-col pb-6">
            <ShopHeader
                error={error}
                params={params}
            />
            <FiltersContainer width={width} />
            <ConditionalRender
                isLoading={isLoading}
                isSuccess={isSuccess}
                itemsObject={itemsObject}
                error={error}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                prevPage={prevPage}
                nextPage={nextPage}
            />
        </div>
    )
}