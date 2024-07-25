import React from 'react';
import {useTranslation} from "react-i18next";
import {useOrderStore} from "../../store";

const ShippingMethods = () => {
    const { t } = useTranslation();
    const { shippingMethods } = useOrderStore();
    return (
        <div className="flex flex-col items-left p-12">
            <h1 className="text-2xl">{t('stuff:shippingMethods')}</h1>
            <section>
                <ul>
                    {Array.isArray(shippingMethods) && shippingMethods.map((method, index) =>(
                        <li key={index}>{`${method.shipping_name}: ${method.price}`}<span>{t('shop:price')}</span></li>
                    ))}
                </ul>
            </section>
        </div>
    )
};

export default ShippingMethods;