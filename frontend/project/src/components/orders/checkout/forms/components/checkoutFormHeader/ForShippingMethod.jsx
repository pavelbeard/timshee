import { useTranslation } from "react-i18next";
import { useCheckoutFormContext } from "../../../../../../lib/hooks";

export default function ForShippingMethod() {
  const { t } = useTranslation();
  const { order } = useCheckoutFormContext();

  if (order?.shipping_method) {
    return (
      <div className="p-2 flex items-center justify-between border-lrb">
        <span>{order.shipping_method.shipping_name}</span>
        <span>{t("orders.checkout:shippingMethod")}</span>
      </div>
    );
  }

  return null;
}
