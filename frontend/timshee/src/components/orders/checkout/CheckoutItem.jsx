import { useTranslation } from "react-i18next";
import ItemImage from "../../ui/ItemImage";

export default function CheckoutItem({ item }) {
  const { t } = useTranslation();
  return (
    <div className="p-2 flex" data-checkout-item="">
      <section className="w-1/5 md:w-2/6 lg:w-3/12" data-checkout-item-img="">
        <ItemImage
          className={"h-24 md:h-32 lg:h-40"}
          src={`${item?.item?.item?.image}`}
          alt={`alt-checkout-item-${item?.id}`}
        />
      </section>
      <section className="ml-4 w-1/2 lg:w-1/3" data-checkout-item-info="">
        <div className="flex justify-between">
          <span className="roboto-text-medium">{item?.item?.item?.name}</span>
          <span className="roboto-text-medium">
            {item?.item?.item?.price}
            {t("shop:price")}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="roboto-text">{item?.item?.size?.value}</span>
          <span className="roboto-text">{item?.item?.color?.name}</span>
        </div>
        <div className="mt-4">
          <span className="flex justify-center items-center bg-gray-300 rounded-2xl size-6">
            {item?.quantity}
          </span>
        </div>
      </section>
    </div>
  );
}
