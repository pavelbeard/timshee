import { useTranslation } from "react-i18next";

export default function CartIsEmpty() {
  const { t } = useTranslation();
  return (
    <div className="pt-12 flex justify-center items-center">
      <h1>{t("cart:cartIsEmpty")}</h1>
    </div>
  );
}
