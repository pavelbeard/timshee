import React from "react";
import App from "./App";
import {useTranslation} from "react-i18next";
import {useGetCurrentLanguageQuery, useGetDynamicSettingsQuery} from "./redux/features/api/stuffApiSlice";
import Loading from "./pages/Loading";
import OnContentUpdate from "./pages/OnContentUpdate";
import OnMaintenance from "./pages/OnMaintenance";
import {useRefreshQuery} from "./redux/features/api/authApiSlice";
import {useGetStoreDataQuery} from "./redux/features/api/storeApiSlice";

export default function AppLoader() {
    const { i18n } = useTranslation();

    const { isLoading: areStoreDataLoading } = useGetStoreDataQuery();
    const { isLoading: isTokenLoading } = useRefreshQuery();
    const { isLoading: isServerLangLoading } = useGetCurrentLanguageQuery();
    const { currentData: dynamicSettings, isLoading: areDynamicSettingsLoading } = useGetDynamicSettingsQuery();
    const isLoading =
        areStoreDataLoading &&
        areDynamicSettingsLoading &&
        isTokenLoading &&
        isServerLangLoading &&
        i18n.isInitialized === undefined;

    if (isLoading) {
        return <Loading />;
    } else if (dynamicSettings?.onContentUpdate){
        return <OnContentUpdate />
    } else if (dynamicSettings?.onMaintenance) {
        return <OnMaintenance />
    } else if (!isLoading) {
        return <App />
    }
}