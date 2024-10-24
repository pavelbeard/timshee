import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { useSearchParameters } from "../../../lib/hooks";
import { useGetStatusQuery } from "../../../redux/features/api/paymentApiSlice";
import { selectPaymentStatus } from "../../../redux/features/store/paymentSlice";
import Error from "../../Error";
import Loading from "../../Loading";

const OrderCheckPayment = () => {
  const { orderId } = useParams();
  const { get } = useSearchParameters();
  const orderNumber = get("order_number");
  const { data: status, isLoading, isError } = useGetStatusQuery(orderId);
  const paymentStatus = useSelector(selectPaymentStatus);

  if (isLoading) {
    return <Loading />;
  }

  if (status === paymentStatus.pending) {
    return (
      <Navigate
        to={`/orders/${orderId}/status/failed?order_number=${orderNumber}`}
      />
    );
  }

  if (status === paymentStatus.succeeded) {
    return (
      <Navigate
        to={`/orders/${orderId}/status/paid?order_number=${orderNumber}`}
      />
    );
  }

  if (isError) {
    return <Error />;
  }
};

export default OrderCheckPayment;
