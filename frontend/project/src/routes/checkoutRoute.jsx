import Checkout from "../pages/orders/checkout/Checkout";
import { CheckoutFormProvider } from "../providers/CheckoutFormProvider";

export const checkoutRoute = [
  {
    path: ":orderId/:step",
    element: (
      <CheckoutFormProvider>
        <Checkout />
      </CheckoutFormProvider>
    ),
  },
];
