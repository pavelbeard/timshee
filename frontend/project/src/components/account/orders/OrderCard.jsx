import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { toCamelCase } from "../../../lib/stuff";
import UnderlinedButton from "../../ui/UnderlinedButton";
import OrderItemImages from "./OrderItemImages";
import ReturnedItemImages from "./ReturnedtemImages";

export default function OrderCard(props) {
  const { t } = useTranslation();
  const { order } = props;
  const divider = clsx("bg-gray-300 mb-2 h-[0.0825rem]");
  return (
    <div className="flex flex-col bg-gray-100 p-6">
      <div className="roboto-medium">{order?.order_number}</div>
      <div className={divider}></div>
      {order.status === "completed" ? (
        <div className="flex justify-between">
          <span className="roboto-light">{t("account:deliveredAt")}</span>
          <span className="roboto-light">
            {new Date(order?.updated_at).toDateString()}
          </span>
        </div>
      ) : (
        <>
          <div className="flex max-sm:flex-col sm:flex-col justify-between">
            <span className="roboto-light">{t("account.orders:status")}</span>
            <span className="roboto-light">
              {t(`account.orders:${toCamelCase(order.status)}`)}
            </span>
          </div>
          <div className="flex max-sm:flex-col sm:flex-col justify-between">
            <span className="roboto-light">
              {t("account.orders:createdAt")}
            </span>
            <span className="roboto-light">
              {new Date(order?.created_at).toDateString()}
            </span>
          </div>
        </>
      )}
      {order.order_item.length > 0 ? (
        <OrderItemImages order={order} />
      ) : (
        <ReturnedItemImages order={order} />
      )}
      <div className="flex justify-between">
        <UnderlinedButton
          to={`/orders/${order.second_id}/detail`}
          className={clsx(
            "roboto-medium hover:text-gray-400 underline underline-offset-4 cursor-pointer",
          )}
        >
          {t("account.orders:orderDetail")}
        </UnderlinedButton>
        <UnderlinedButton
          className={clsx(
            "roboto-medium underline underline-offset-4",
            order.non_refundable || order.status === "refunded"
              ? "cursor-not-allowed text-gray-400 disabled"
              : "cursor-pointer hover:text-gray-400",
          )}
          to={
            !order.non_refundable
              ? `/orders/${order.second_id}/refund`
              : undefined
          }
        >
          {t("account.orders:returnOrder")}
        </UnderlinedButton>
      </div>
    </div>
  );
}
