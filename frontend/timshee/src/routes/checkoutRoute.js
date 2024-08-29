import {CheckoutFormProvider} from "../providers/CheckoutFormProvider";
import Checkout from "../pages/orders/checkout/Checkout";
import React from "react";

export const checkoutRoute = [
    { path: ':orderId/:step', element: <CheckoutFormProvider><Checkout /></CheckoutFormProvider> },
];