import { useParams } from "react-router-dom";
import RefundForm from "../../../components/orders/refund/forms/RefundForm";
import { useSearchParameters } from "../../../lib/hooks";
import { useGetOrderQuery } from "../../../redux/features/api/orderApiSlice";
import Error from "../../Error";
import Loading from "../../Loading";
import Nothing from "../../Nothing";

const OrderRefund = () => {
  const { orderId } = useParams();
  const { get } = useSearchParameters();
  const stockItemId = parseInt(get("item_id")) || 0;
  const stockItemQuantity = parseInt(get("item_q")) || 0;
  const { isLoading, data: order, error } = useGetOrderQuery(orderId);

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <Error />;
  } else if (order) {
    return (
      <RefundForm stockId={stockItemId} stockQuantity={stockItemQuantity} />
    );
  } else {
    return <Nothing />;
  }
};

export default OrderRefund;
