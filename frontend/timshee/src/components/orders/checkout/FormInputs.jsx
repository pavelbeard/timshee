import {useCheckoutFormContext} from "../../../lib/hooks";
import ShippingAddress from "./forms/ShippingAddress";
import ShippingMethods from "./forms/ShippingMethods";
import Payment from "./forms/Payment";
import React from "react";
import {useTranslation} from "react-i18next";

export default function FormInputs() {
    const { page } = useCheckoutFormContext();
    const display = {
        1: <ShippingAddress />,
        2: <ShippingMethods />,
        3: <Payment />
    };

    return <section className="flex flex-col">
        {display[page]}
    </section>;
}