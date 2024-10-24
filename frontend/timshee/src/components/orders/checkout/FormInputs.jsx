import { useCheckoutFormContext } from "../../../lib/hooks";
import Payment from "./forms/Payment";
import ShippingAddress from "./forms/ShippingAddress";
import ShippingMethods from "./forms/ShippingMethods";

export default function FormInputs() {
  const { page } = useCheckoutFormContext();
  const display = {
    1: <ShippingAddress />,
    2: <ShippingMethods />,
    3: <Payment />,
  };

  return <section className="flex flex-col">{display[page]}</section>;
}
