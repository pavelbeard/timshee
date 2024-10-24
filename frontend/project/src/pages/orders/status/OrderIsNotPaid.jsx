import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { useSearchParameters } from "../../../lib/hooks";

const OrderIsNotPaid = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const { get } = useSearchParameters();
  const orderNumber = get("order_number");
  const navigate = useNavigate();

  return (
    <Container>
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="text-2xl">
          <h1>{t("orders.checkout:failed", { orderNumber })}</h1>
        </div>
        <Button
          width="w-1/3"
          onClick={() => navigate(`/checkout/${orderId}/payment`)}
        >
          {t("orders.checkout:backToCheckout")}
        </Button>
      </div>
    </Container>
  );
};

export default OrderIsNotPaid;
