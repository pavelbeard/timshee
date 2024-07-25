import AuthService from "../../main/api/authService";
import {useAuthProvider, useGlobalStore, useOrderStore, useShopStore} from "../../store";
import {useEffect, useState} from "react";

export const useToken = () => {
    const token = AuthService.getAccessToken();
    return token;
};

export const useAuthentication = () => {
    const token = useToken();
    const { verify, refresh, isVerified, isRefreshed } = useAuthProvider();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if(token?.access) {
                await verify(token.access);
                if (!isVerified) {
                    await refresh();
                }
            }
        })();
        setIsLoading(false);
    }, []);

    return { isVerified, isRefreshed, isLoading, token };
}

export const useGlobalStuff = () => {
    const token = useToken();
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
            await getDynamicSettings(token);

            await getCollectionLinks();
            await getCollections();
            await getCategories();

            await getShippingMethods(token);
        })();
    }, []);


    return {
        countries, provinces, phoneCodes, dynamicSettings,
        collectionLinks, collections, categories, shippingMethods,
    };
}