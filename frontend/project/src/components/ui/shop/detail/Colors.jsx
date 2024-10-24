import { clsx } from "clsx";
import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useSearchParameters } from "../../../../lib/hooks";
import {
  selectColorsWithSelection,
  selectStocks,
  setColorsWithSelection,
} from "../../../../redux/features/store/storeSlice";

export default function Colors() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const colorsWithSelection = useSelector(selectColorsWithSelection);
  const { get, replace } = useSearchParameters();
  const stocks = useSelector(selectStocks);
  // SET DATA AFTER RELOADING PAGE
  const initColors = useCallback(() => {
    const color = get("color");
    const found = colorsWithSelection.some((c) => c.name === color);
    if (color && found) {
      dispatch(
        setColorsWithSelection(
          [...colorsWithSelection].map((c) =>
            c.name === color
              ? { ...c, selected: true }
              : { ...c, selected: false },
          ),
        ),
      );
    } else {
      navigate("/not-found");
    }
  }, [get, dispatch, colorsWithSelection]);

  useEffect(() => {
    if (colorsWithSelection && colorsWithSelection.length > 0) {
      initColors();
    }
  }, []);

  const inStock = (color) =>
    stocks?.find((s) => s.size === get("size") && s.color === color)?.inStock >
    0;

  // MEMORIZING FUNC
  const setSelection = useCallback(
    (e) => {
      const i = parseInt(e.currentTarget?.getAttribute("value"));
      const colorId = e.currentTarget?.id;
      if (inStock(colorId)) {
        replace("color", colorId);
        dispatch(
          setColorsWithSelection(
            [...colorsWithSelection].map((c, idx) =>
              idx === i ? { ...c, selected: true } : { ...c, selected: false },
            ),
          ),
        );
      }
    },
    [dispatch, replace, colorsWithSelection, inStock],
  );

  // MEMORIZING ARRAY
  const colorsCircles = useMemo(
    () =>
      colorsWithSelection.map((color, i) => (
        <li
          role="option"
          value={i}
          id={color?.name}
          key={i}
          className={clsx(
            "relative size-8 rounded-2xl flex justify-center items-center",
            colorsWithSelection.find((c, idx) => idx === i && c.selected)
              ?.selected && "border-[1px] border-gray-600 opacity-75",
            inStock(color?.name)
              ? "hover:border-[1px] hover:border-gray-200 hover:opacity-75"
              : "border-[1px] border-gray-600 opacity-50 pointer-events-none not-in-stock",
          )}
          style={{ background: color?.hex?.toLowerCase() }}
          onClick={setSelection}
        ></li>
      )),
    [setSelection, colorsWithSelection],
  );

  return (
    <ul
      role="listbox"
      className="py-4 grid grid-cols-7 lg:grid-cols-8 items-center justify-items-center justify-center gap-2"
    >
      {colorsCircles}
    </ul>
  );
}
