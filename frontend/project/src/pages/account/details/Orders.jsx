import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../../components/account/orders/OrderCard";
import Container from "../../../components/ui/Container";
import { useGetOrdersByUserQuery } from "../../../redux/features/api/accountApiSlice";
import { selectCurrentOrders } from "../../../redux/features/store/accountSlice";
import Nothing from "../../Nothing";

const Orders = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ordersList = useSelector(selectCurrentOrders);
  const { data: orders_ } = useGetOrdersByUserQuery();
  const orders = ordersList || orders_;
  return (
    <Container data-orders-container="">
      <section
        className={clsx(
          "flex w-48 max-sm:w-full items-center justify-start mb-3 cursor-pointer",
          "hover:text-gray-300",
        )}
        onClick={() => navigate("/account/details")}
      >
        <ArrowLeftIcon strokeWidth="0.5" className={clsx("size-4 mr-3")} />
        <span className="roboto-light">{t("account:returnToAccount")}</span>
      </section>
      <section></section>
      <section
        className={clsx(
          "gap-4",
          "max-sm:flex max-sm:flex-col",
          "sm:grid sm:grid-cols-2",
          "md:grid md:grid-cols-2",
          "lg:grid lg:grid-cols-3",
        )}
        data-order-cards=""
      >
        {orders?.length > 0 ? (
          orders?.map((order, index) => <OrderCard key={index} order={order} />)
        ) : (
          <Nothing reason={t("account.orders:noOrders")} />
        )}
      </section>
    </Container>
  );
};

export default Orders;
