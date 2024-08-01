import {useAuthProvider, useGlobalStore, useOrderStore, useShopStore} from "../../store";
import {useEffect, useState} from "react";

export const useGlobalStuff = () => {
    const {
        countries, provinces, phoneCodes, dynamicSettings,
        getCountries, getProvinces, getPhoneCodes, getDynamicSettings
    } = useGlobalStore();
    const {
        collectionLinks, collections, categories,
        getCollectionLinks, getCollections, getCategories,
    } = useShopStore() || {};
    const {
        shippingMethods, getShippingMethods
    } = useOrderStore();


    useEffect(() => {
        (async () => {
            await getCountries();
            await getProvinces();
            await getPhoneCodes();
            await getDynamicSettings();

            await getCollectionLinks();
            await getCollections();
            await getCategories();

            await getShippingMethods();
        })();
    }, []);


    return {
        countries, provinces, phoneCodes, dynamicSettings,
        collectionLinks, collections, categories, shippingMethods,
    };
}