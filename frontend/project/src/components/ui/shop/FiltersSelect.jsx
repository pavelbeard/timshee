import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAppDispatch, useSearchParameters } from "../../../lib/hooks";
import {
  selectOrderBy,
  setOrderBy,
} from "../../../redux/features/store/storeSlice";
import Select from "../Select";

export default function FiltersSelect() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const orderByList = useSelector(selectOrderBy);
  const { search, remove, replace } = useSearchParameters();

  const initSelect = () => {
    const o = search.getAll("o")[0];
    if (o) dispatch(setOrderBy(o));
  };

  const changeOrderBy = (e) => {
    const value = e.currentTarget.getAttribute("value");
    value === ""
      ? remove("o", orderByList.find((o) => o.selected)?.value)
      : replace("o", value);
    dispatch(setOrderBy(value));
  };

  useEffect(() => {
    initSelect();
  }, [search]);

  return (
    <Select
      htmlFor="o"
      labelText={t("shop:orderBy")}
      value={orderByList.find((o) => o.selected)?.name}
      values={orderByList}
      onChange={changeOrderBy}
      accessValue={"value"}
      valueLabel={"name"}
    />
  );
}
