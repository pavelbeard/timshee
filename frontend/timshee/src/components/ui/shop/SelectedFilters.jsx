import {useSelector} from "react-redux";
import {selectFilters} from "../../../redux/features/store/storeSlice";
import {useTranslation} from "react-i18next";
import {useResetFiltersAll} from "../../../lib/hooks";

export default function SelectedFilters() {
    const { t } = useTranslation();
    const filters = useSelector(selectFilters);
    const resetAll = useResetFiltersAll();
    const mappedFilters = filters.map((filter, index) =>
        <p key={index} className="mr-1">{filter}</p>);


    // useEffect(() => {
    //     resetAll();
    // }, [gender]);

    return  filters?.length > 0 && (
        <div className="flex mx-6">
            {mappedFilters}
            <button className="underline underline-offset-4" onClick={resetAll}>
                {t('shop:reset')}
            </button>
        </div>
    );
}