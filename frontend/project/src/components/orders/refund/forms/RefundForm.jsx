import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useSearchParameters } from "../../../../lib/hooks";
import Nothing from "../../../../pages/Nothing";
import { useGetOrderQuery } from "../../../../redux/features/api/orderApiSlice";
import {
  useRefundPartialMutation,
  useRefundWholeMutation,
} from "../../../../redux/features/api/paymentApiSlice";
import RefundFormSkeleton from "../../../skeletons/orders/forms/RefundFormSkeleton";
import BackButton from "../../../ui/BackButton";
import Button from "../../../ui/Button";
import Container from "../../../ui/Container";
import CustomInput from "../../../ui/forms/CustomInput";
import CustomTitle from "../../../ui/forms/CustomTitle";
import Radio from "../../../ui/Radio";
import Range from "../../../ui/Range";

const RefundForm = ({ stockId = 0, stockQuantity = 0 }) => {
  const { t } = useTranslation();
  const { replace, get } = useSearchParameters();
  const { orderId } = useParams();
  const [reason, setReason] = useState({ id: 0, reason: "It didn't like" });
  const [quantity, setQuantity] = useState(1);
  const [checkedPartial, setCheckedPartial] = useState(false);
  const [checked, setChecked] = useState(false);
  const [
    refundWhole,
    {
      error: refundWholeErr,
      isError: isRefundWholeErr,
      isSuccess: hasRefundedWhole,
    },
  ] = useRefundWholeMutation();
  const [
    refundPartial,
    {
      error: refundPartialErr,
      isError: isRefundPartialErr,
      isSuccess: hasRefundedPartial,
    },
  ] = useRefundPartialMutation();
  const { isLoading, data: order, error } = useGetOrderQuery(orderId);

  useEffect(() => {
    if (order) {
      // CHECKING ORDER FOR EXISTING ITEMS IN HIM
      // IF NOT THEN WHOLE ORDER WILL BE RETURNED
      const checkOrderNumber = order?.second_id === orderId;
      const checkQuantity = order?.order_item?.find(
        (o) =>
          o.quantity === parseInt(stockQuantity) &&
          o.item.id === parseInt(stockId),
      );
      const checkPartial = checkOrderNumber && checkQuantity;

      if (checkPartial !== undefined && checkPartial !== null) {
        setCheckedPartial(true);
      } else {
        setChecked(true);
      }
    }
  }, [order]);

  useEffect(() => {
    replace("reason", reason.id);
  }, [reason]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const refundReason = e.currentTarget
      ?.querySelector('[aria-checked="true"]')
      ?.querySelector("label.ml-2")?.innerHTML;

    let data;
    if (checkedPartial) {
      data = {
        stock_item_id: parseInt(stockId),
        quantity: reason.id === 6 ? quantity : stockQuantity,
        quantity_total: stockQuantity,
        reason: reason.reason,
      };

      refundPartial({ orderId, data })
        .unwrap()
        .then()
        .catch((err) => null);
    } else if (checked) {
      data = {
        quantity: parseInt(stockQuantity),
        reason: reason.reason,
      };

      refundWhole({ orderId, data })
        .unwrap()
        .then()
        .catch((err) => null);
    }
  };

  if (hasRefundedPartial || hasRefundedWhole) {
    return (
      <Container className="mx-6 mb-3 flex flex-col">
        <BackButton to={`/orders/${orderId}/detail`}>
          {t("account.refundForm:returnToOrder")}
        </BackButton>
        <h3 className="roboto-medium">
          {t("account.refundForm:orderReturned")}
        </h3>
      </Container>
    );
  } else if (isLoading) {
    return <RefundFormSkeleton />;
  } else if (checked || checkedPartial) {
    return (
      <div className="mx-6 mb-3 flex flex-col" data-refund-form-container="">
        <BackButton to={`/orders/${orderId}/detail`}>
          {t("account.refundForm:returnToOrder")}
        </BackButton>
        <div className="flex flex-col lg:items-center">
          <form onSubmit={handleSubmit} className="p-6 bg-gray-300 lg:w-1/2">
            <CustomTitle title={t("account.refundForm:refundForm")} />
            <CustomTitle title={t("account.refundForm:question")} />
            <Radio
              htmlFor="didnt-like"
              type="radio"
              labelText={t("account.refundForm:dontLike")}
              required={0 === reason.id}
              checked={0 === reason.id}
              onChange={() => setReason({ id: 0, reason: "It didn't like" })}
            />
            <Radio
              htmlFor="color-size-isnt-correct"
              type="radio"
              labelText={t("account.refundForm:dontCorrect")}
              required={1 === reason.id}
              checked={1 === reason.id}
              onChange={() =>
                setReason({ id: 1, reason: "Item's color/size isn't correct" })
              }
            />
            <Radio
              htmlFor="wrong-description"
              type="radio"
              labelText={t("account.refundForm:wrongDescription")}
              required={2 === reason.id}
              checked={2 === reason.id}
              onChange={() =>
                setReason({
                  id: 2,
                  reason: "Item doesn't match the description in the store",
                })
              }
            />
            <Radio
              htmlFor="appearance"
              type="radio"
              labelText={t("account.refundForm:wrongAppearance")}
              required={3 === reason.id}
              checked={3 === reason.id}
              onChange={() =>
                setReason({ id: 3, reason: "Dissatisfaction with appearance" })
              }
            />
            <Radio
              htmlFor="long-shipping"
              type="radio"
              labelText={t("account.refundForm:longShipping")}
              required={4 === reason.id}
              checked={4 === reason.id}
              onChange={() =>
                setReason({ id: 4, reason: "Shipping is very long" })
              }
            />
            <Radio
              htmlFor="order-errors"
              type="radio"
              labelText={t("account.refundForm:wrongItemOrdered")}
              required={5 === reason.id}
              checked={5 === reason.id}
              onChange={() =>
                setReason({ id: 5, reason: "Wrong item ordered" })
              }
            />
            {stockId > 0 && stockQuantity > 1 && (
              <Radio
                htmlFor="wrong-quantity"
                type="radio"
                labelText={t("account.refundForm:wrongQuantity")}
                required={6 === reason.id}
                checked={6 === reason.id}
                onChange={() =>
                  setReason({
                    id: 6,
                    reason: "I ordered more items than I wanted",
                  })
                }
              />
            )}
            {reason.id === 6 && stockQuantity > 1 && (
              <>
                <div className="flex justify-between w-6/12">
                  <span>
                    {t("account.refundForm:max")} {stockQuantity}
                  </span>
                  <span>
                    {t("account.refundForm:current")} {quantity}
                  </span>
                </div>
                <Range
                  htmlFor="wrong-quantity-counter"
                  type="range"
                  value={quantity}
                  min={stockQuantity === 1 ? "0" : "1"}
                  disabled={stockQuantity === 1}
                  max={`${stockQuantity}`}
                  onChange={(e) => {
                    setQuantity(parseInt(e.target.value));
                  }}
                />
              </>
            )}
            <CustomInput
              htmlFor="other"
              type="textarea"
              labelText={t("account.refundForm:otherReasons")}
              required={7 === reason.id}
              onClickCapture={() => setReason({ id: 7, reason: "" })}
              onChange={(e) => setReason({ id: 7, reason: e.target.value })}
            />
            <Button>{t("account.refundForm:refundItem")}</Button>
            {isRefundPartialErr ||
              (isRefundWholeErr && (
                <div className="text-red-500">
                  {refundWholeErr?.message || refundPartialErr?.message}
                </div>
              ))}
          </form>
        </div>
      </div>
    );
  } else {
    return <Nothing />;
  }
};

export default RefundForm;
