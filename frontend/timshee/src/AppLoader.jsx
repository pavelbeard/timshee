import React, {useEffect} from "react";
import App from "./App";
import {useTranslation} from "react-i18next";
import {useGetDynamicSettingsQuery} from "./redux/features/api/stuffApiSlice";
import Loading from "./pages/Loading";
import OnContentUpdate from "./pages/OnContentUpdate";
import OnMaintenance from "./pages/OnMaintenance";
import {useRefreshQuery} from "./redux/features/api/authApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "./redux/features/store/authSlice";


export default function AppLoader() {
    const { i18n } = useTranslation();
    // const [triggerRefresh, {isLoading: isTokenLoading }] = useLazyRefreshQuery();
    const { isLoading: isTokenLoading } = useRefreshQuery();
    const { currentData: dynamicSettings, isLoading: areDynamicSettingsLoading } = useGetDynamicSettingsQuery();
    const token = useSelector(selectCurrentToken)
    const isLoading =
        areDynamicSettingsLoading &&
        isTokenLoading &&
        i18n.isInitialized === undefined;

    const callRefresh = () => {
        // triggerRefresh().unwrap()
        //     .then(res => console.log(res))
        //     .catch(err => console.error(err));
    };

    useEffect(() => {

    }, [])

    if (isLoading) {
        return <Loading />;
    } else if (dynamicSettings?.onContentUpdate){
        return <OnContentUpdate />
    } else if (dynamicSettings?.onMaintenance) {
        return <OnMaintenance />
    }


    return <App />
}