import { XMarkIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useAppDispatch, useResetFiltersAll } from "../../../lib/hooks";
import { setOpenBlock } from "../../../redux/features/store/storeSlice";
import { toggleFiltersMenu } from "../../../redux/features/store/uiControlsSlice";
import ItemsTotal from "./ItemsTotal";

export default function FiltersHeaderSm({ robotoText }) {
  const dispatch = useAppDispatch();
  const resetAll = useResetFiltersAll();

  const close = () => {
    resetAll();
    dispatch(setOpenBlock(null));
    dispatch(toggleFiltersMenu(false));
  };

  return (
    <div>
      <div
        className="flex justify-between items-center border-b-[1px] border-gray-200"
        data-narrow-filters-t=""
      >
        <div className="flex items-center">
          <ItemsTotal className={clsx(robotoText, "pl-2")} />
        </div>
        <XMarkIcon strokeWidth="0.5" className="size-4" onClick={close} />
      </div>
    </div>
  );
}
