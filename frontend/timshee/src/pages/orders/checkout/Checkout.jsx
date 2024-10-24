import { clsx } from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CheckoutHeader from "../../../components/orders/checkout/CheckoutHeader";
import CheckoutItems from "../../../components/orders/checkout/CheckoutItems";
import FormInputs from "../../../components/orders/checkout/FormInputs";
import CheckoutFormHeader from "../../../components/orders/checkout/forms/components/CheckoutFormHeader";
import ForShippingAddress from "../../../components/orders/checkout/forms/components/checkoutFormHeader/ForShippingAddress";
import ForShippingMethod from "../../../components/orders/checkout/forms/components/checkoutFormHeader/ForShippingMethod";
import BackButton from "../../../components/ui/BackButton";
import Button from "../../../components/ui/Button";
import CustomTitle from "../../../components/ui/forms/CustomTitle";
import ShowHideButton from "../../../components/ui/ShowHideButton";
import { useCheckoutFormContext, useWindowSize } from "../../../lib/hooks";

export default function Checkout() {
  window.document.title = "Checkout | Timshee store";
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const {
    order,
    shippingMethods,
    formData,
    title,
    page,
    formName,
    handleSubmit,
    stageName,
  } = useCheckoutFormContext();
  const [showHideCheckoutItems, setShowHideCheckoutItems] = useState(true);
  const shippingPrice =
    shippingMethods?.find((sm) => sm.id === formData?.shipping_method)?.price ||
    order?.shipping_price;
  const totalPrice =
    parseFloat(shippingPrice) + parseFloat(order?.items_total_price);

  return (
    <section className="flex flex-col-reverse justify-end min-h-[100vh] lg:grid lg:grid-cols-2">
      <section
        className="flex flex-col border-gray-200 lg:border-r-[1px]"
        data-checkout-container=""
      >
        <CheckoutHeader />
        <div className="mx-6 mt-6">
          <CustomTitle className="px-2" title={title[page]} />
          <CheckoutFormHeader user={formData?.shipping_address?.email || ""} />
          <ForShippingAddress />
          <ForShippingMethod />
        </div>
        <form
          className="flex flex-col mx-6 mb-24"
          name={formName[page]}
          onSubmit={handleSubmit}
        >
          <FormInputs />
          <div
            className={clsx(
              "flex",
              page === 3
                ? "flex-col items-center"
                : "flex-col xl:flex-row xl:justify-between",
            )}
          >
            <BackButton className={"mb-0 mt-2"} to={stageName[page - 1]?.link}>
              {stageName[page - 1]?.title}
            </BackButton>
            <Button
              className={clsx(page !== 3 && "h-6")}
              width="xl:w-1/2"
              type="submit"
            >
              {page === 3
                ? t("orders.checkout:payment")
                : stageName[page + 1]?.title}
            </Button>
          </div>
        </form>
      </section>
      <section className={clsx("bg-gray-50 flex flex-col p-6")}>
        <ShowHideButton
          showHideItems={showHideCheckoutItems}
          setShowHideItems={setShowHideCheckoutItems}
        >
          {t("orders.checkout:showOrderItems")}
        </ShowHideButton>
        <div
          className={clsx(
            " h-60 lg:h-80 overflow-y-auto border-b-[1px] border-gray-200",
            showHideCheckoutItems && width < 1024 ? "hidden" : "flex flex-col",
          )}
        >
          <CheckoutItems orderItems={order?.order_item} />
        </div>
        <div className="flex flex-col" data-price-for-all="">
          <div className="flex items-center justify-between">
            <span className="tracking-wider lg:text-xl">
              {t("orders.checkout:subtotal")}
            </span>
            <span className="tracking-wider lg:text-xl">
              {order?.items_total_price}
              {t("shop:price")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="tracking-wider lg:text-xl">
              {t("orders.checkout:shippingPrice")}
            </span>
            <span className="tracking-wider lg:text-xl">
              {shippingPrice}
              {t("shop:price")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-lg lg:text-2xl">
              {t("orders.checkout:total")}
            </span>
            <span className="tracking-wider text-lg lg:text-2xl">
              {totalPrice.toFixed(2)}
              {t("shop:price")}
            </span>
          </div>
        </div>
      </section>
    </section>
  );
}
