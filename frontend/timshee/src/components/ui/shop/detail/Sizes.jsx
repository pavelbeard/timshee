import { clsx } from "clsx";
import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useSearchParameters } from "../../../../lib/hooks";
import {
  selectSizesWithSelection,
  selectStocks,
  setSizesWithSelection,
} from "../../../../redux/features/store/storeSlice";

export default function Sizes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sizesWithSelection = useSelector(selectSizesWithSelection);
  const { get, replace } = useSearchParameters();
  const stocks = useSelector(selectStocks);

  // SET DATA AFTER RELOADING PAGE
  const initSizes = useCallback(() => {
    const size = get("size");
    const found = sizesWithSelection.some((c) => c.value === size);
    if (size && found) {
      dispatch(
        setSizesWithSelection(
          [...sizesWithSelection]?.map((s) =>
            s.value === size
              ? { ...s, selected: true }
              : { ...s, selected: false },
          ),
        ),
      );
    } else {
      navigate("/not-found");
    }
  }, [get, dispatch, sizesWithSelection]);

  useEffect(() => {
    if (sizesWithSelection && sizesWithSelection.length > 0) {
      initSizes();
    }
  }, []);

  const inStock = (size) =>
    stocks?.find((s) => s.size === size && s.color === get("color"))?.inStock >
    0;

  // MEMORIZING FUNC
  const setSelection = useCallback(
    (e) => {
      const i = parseInt(e.currentTarget?.getAttribute("value"));
      const sizeId = e.currentTarget?.id;
      if (inStock(sizeId)) {
        replace("size", sizeId);
        dispatch(
          setSizesWithSelection(
            [...sizesWithSelection].map((s, idx) =>
              idx === i ? { ...s, selected: true } : { ...s, selected: false },
            ),
          ),
        );
      }
    },
    [dispatch, replace, sizesWithSelection, inStock],
  );

  // MEMORIZING ARRAY
  const sizesCircles = useMemo(
    () =>
      sizesWithSelection.map((size, i) => (
        <li
          role="option"
          value={i}
          id={size?.value}
          key={i}
          className={clsx(
            "relative size-8 rounded-2xl border-gray-600 border-[1px] flex justify-center items-center",
            sizesWithSelection.find((s, idx) => idx === i && size?.selected)
              ?.selected && "bg-black text-white",
            inStock(size?.value)
              ? "hover:bg-black hover:text-white "
              : "bg-gray-200 pointer-events-none not-in-stock",
          )}
          onClick={setSelection}
        >
          <span className="roboto-text-medium">{size?.value}</span>
        </li>
      )),
    [setSelection, sizesWithSelection],
  );

  return (
    <ul
      role="listbox"
      className="py-4 grid grid-cols-7 lg:grid-cols-8 items-center justify-items-center justify-center gap-2"
    >
      {sizesCircles}
    </ul>
  );
}
