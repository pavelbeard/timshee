import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useResetFiltersAll } from "../../../lib/hooks";
import { setOpenBlock } from "../../../redux/features/store/storeSlice";
import Button from "../Button";

export default function FiltersFooterSm({ onClose }) {
  const dispatch = useAppDispatch();
  const resetAll = useResetFiltersAll();
  const { t } = useTranslation();
  const style = clsx(
    "flex mb-24 justify-between border-t-[1px] border-gray-200",
  );
  const apply = () => {
    dispatch(setOpenBlock(null));
    onClose();
  };

  return (
    <div className={style}>
      <Button
        className={clsx(
          "mr-3 border-none hover:bg-black hover:text-white hover:outline hover:outline-blue-200",
        )}
        onClick={resetAll}
      >
        {t("shop:reset")}
      </Button>
      <Button className="ml-3" onClick={apply}>
        {t("shop:apply")}
      </Button>
    </div>
  );
}
