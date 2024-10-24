import Core from "./Core";
import i18n from "./i18n";
import Loading from "./pages/Loading";
import OnContentUpdate from "./pages/OnContentUpdate";
import OnMaintenance from "./pages/OnMaintenance";
import { useRefreshQuery } from "./redux/features/api/authApiSlice";
import { useGetStoreDataQuery } from "./redux/features/api/storeApiSlice";
import {
  useGetCurrentLanguageQuery,
  useGetDynamicSettingsQuery,
} from "./redux/features/api/stuffApiSlice";

export default function AppLoader() {
  const { isLoading: areStoreDataLoading } = useGetStoreDataQuery();
  const { isLoading: isTokenLoading } = useRefreshQuery();
  const { isLoading: isServerLangLoading } = useGetCurrentLanguageQuery();
  const { currentData: dynamicSettings, isLoading: areDynamicSettingsLoading } =
    useGetDynamicSettingsQuery();
  const isLoading =
    areStoreDataLoading &&
    areDynamicSettingsLoading &&
    isTokenLoading &&
    isServerLangLoading &&
    i18n.isInitialized === undefined;

  if (isLoading) {
    return <Loading />;
  } else if (dynamicSettings?.onContentUpdate) {
    return <OnContentUpdate />;
  } else if (dynamicSettings?.onMaintenance) {
    return <OnMaintenance />;
  } else if (!isLoading) {
    return <Core />;
  }
}
