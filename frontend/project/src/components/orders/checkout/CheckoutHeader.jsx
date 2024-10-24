import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { Link, useParams } from "react-router-dom";
import { useCheckoutFormContext } from "../../../lib/hooks";
import { ArrayAtPolyfil } from "../../../lib/stuff";
import Logo from "../../ui/header/Logo";

export default function CheckoutHeader() {
  const { orderId, step } = useParams();
  const { title, page } = useCheckoutFormContext();

  const stages = {
    1: `/checkout/${orderId}/address-info`,
    2: `/checkout/${orderId}/shipping-info`,
    3: `/checkout/${orderId}/payment`,
  };

  const currentStage = (stage) => ArrayAtPolyfil(stages[stage].split("/"), -1);

  return (
    <section className="flex flex-col items-center p-6">
      <Logo />
      <div className="flex items-center py-2" data-checkout-stages="">
        <Link
          className={clsx("m-1", currentStage(1) !== step && "text-gray-400")}
          to={stages[1]}
        >
          {title[1]}
        </Link>
        <ChevronRightIcon strokeWidth="0.5" className="size-4" />
        <Link
          className={clsx("m-1", currentStage(2) !== step && "text-gray-400")}
          to={stages[2]}
        >
          {title[2]}
        </Link>
        <ChevronRightIcon strokeWidth="0.5" className="size-4" />
        <Link
          className={clsx("m-1", currentStage(3) !== step && "text-gray-400")}
          to={stages[3]}
        >
          {title[3]}
        </Link>
      </div>
    </section>
  );
}
