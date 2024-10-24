import { useEffect } from "react";
import { useAppDispatch, useSearchParameters } from "../../../lib/hooks";
import { toggleCheckboxes } from "../../../redux/features/store/storeSlice";
import Checkbox from "../Checkbox";

export default function Checkboxes({
  htmlFor,
  data,
  labelTextKey,
  category,
  idKey,
}) {
  const dispatch = useAppDispatch();
  const { search, set, remove } = useSearchParameters();

  const initCheckboxes = () => {
    const queryParams = search.getAll(category);
    const updatedItems = data.map((item) => ({
      ...item,
      checked: queryParams.includes(item[htmlFor]),
    }));

    updatedItems.forEach((item) => {
      dispatch(
        toggleCheckboxes({
          category,
          id: item[htmlFor],
          key: idKey,
          checked: item.checked,
        }),
      );
    });
  };

  useEffect(() => {
    initCheckboxes();
  }, [search]);

  const setParams = (e) => {
    const checked = e.target.checked;
    const id = e.target.id;
    dispatch(
      toggleCheckboxes({
        category: category,
        id: e.target.id,
        key: idKey,
        checked: checked,
      }),
    );

    const item = data.find((item) => item[idKey] === id)[htmlFor];
    checked ? set(category, item) : remove(category, item);
  };
  return data?.map((item, index) => (
    <div key={index} className="flex items-center">
      <Checkbox
        htmlFor={item[htmlFor]}
        labelText={item[labelTextKey]}
        disabled={item?.total === 0}
        checked={item?.checked}
        onChange={setParams}
      />
      {item?.total ? (
        <span className="roboto-light text-xs ml-1">({item?.total})</span>
      ) : (
        ""
      )}
    </div>
  ));
}
