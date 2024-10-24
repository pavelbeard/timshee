import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { useSearchParameters } from "../../../lib/hooks";
import { useGetCartItemsQuery } from "../../../redux/features/api/cartApiSlice";
import { selectCurrentToken } from "../../../redux/features/store/authSlice";
import Loading from "../../Loading";

const OrderPaid = () => {
  const { t } = useTranslation();
  const { get } = useSearchParameters();
  const navigate = useNavigate();
  const orderNumber = get("order_number");
  const token = useSelector(selectCurrentToken);
  const { isLoading } = useGetCartItemsQuery();

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center mt-20">
          <h1 className="text-2xl">
            {t(`orders.checkout:succeeded`, { orderNumber })}
          </h1>
          <div className="w-1/3">
            <Button onClick={() => navigate(`/`)}>
              {t("stuff:backToMain")}
            </Button>
            {token && (
              <Button onClick={() => navigate(`/account/details/orders`)}>
                {t("account:seeOrders")}
              </Button>
            )}
          </div>
        </div>
      </Container>
    );
  }
};

export default OrderPaid;
