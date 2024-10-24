import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAppDispatch, useClickOutside } from "../../../lib/hooks";
import { setOpenBlock } from "../../../redux/features/store/storeSlice";

export default function FilterBlockSm({
  tag,
  title,
  reset,
  selected,
  children,
}) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { openBlock } = useSelector((s) => s.store);
  const menuRef = useRef(null);
  const [isOpen, toggleDialog] = useClickOutside(menuRef);

  const toggleFilterBlock = () => {
    if (!isOpen) {
      dispatch(setOpenBlock(tag));
    } else {
      dispatch(setOpenBlock(null));
    }
    toggleDialog();
  };

  if (isOpen) {
    return (
      <div className="w-full overflow-y-auto" data-filter-block-sm="">
        <div className="flex bg-white w-full items-center justify-between">
          <ArrowLeftIcon
            strokeWidth="0.5"
            onClick={toggleFilterBlock}
            className="size-4"
          />
          <div className="flex items-center">
            <button className="roboto-light text-xs mr-2" onClick={reset}>
              {t("shop:reset")}
            </button>
            <span className="roboto-text">{t("shop:selected")} </span>
            <span className="roboto-text ml-1">({selected})</span>
          </div>
        </div>
        <div className="min-h-80 relative overflow-y-auto">{children}</div>
      </div>
    );
  } else {
    return (
      <div>
        <button
          className={openBlock ? "invisible" : "visible roboto-text"}
          onClick={toggleFilterBlock}
        >
          {title}
        </button>
        <span className="ml-1 roboto-text">({selected})</span>
      </div>
    );
  }
}
