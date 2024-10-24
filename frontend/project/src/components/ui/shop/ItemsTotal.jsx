import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectTotalItemsCount } from "../../../redux/features/store/storeSlice";

export default function ItemsTotal({ ...rest }) {
  const { t } = useTranslation();
  const totalItemsCount = useSelector(selectTotalItemsCount);
  return (
    <div {...rest}>
      {t("shop:totalItems")} {totalItemsCount}
    </div>
  );
}
