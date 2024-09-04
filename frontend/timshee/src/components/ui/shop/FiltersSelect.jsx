import Select from "../Select";
import {useDispatch, useSelector} from "react-redux";
import {selectOrderBy, setOrderBy} from "../../../redux/features/store/storeSlice";
import {useTranslation} from "react-i18next";
import {useSearchParameters} from "../../../lib/hooks";
import {useEffect} from "react";

export default function FiltersSelect() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const orderByList = useSelector(selectOrderBy);
    const { search, remove, replace } = useSearchParameters();

    const initSelect = () => {
        const o = search.getAll('o')[0];
        if (o) dispatch(setOrderBy(o));
    };

    const changeOrderBy = e => {
        const value = e.currentTarget.getAttribute('value');
        value === '' ? remove('o', orderByList.find(o => o.selected)?.value) : replace('o', value)
        dispatch(setOrderBy(value));
    };

    useEffect(() => {
        initSelect();
    }, [search]);

    return (
        <Select
            htmlFor="o"
            labelText={t('shop:orderBy')}
            value={orderByList.find(o => o.selected)?.name}
            values={orderByList}
            onChange={changeOrderBy}
            accessValue={'value'}
            valueLabel={'name'}
        />
    );
}