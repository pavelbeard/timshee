import React from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useCheckoutFormContext, useFocus} from "../lib/hooks";
import {useGetShippingMethodsQuery} from "../redux/features/api/accountApiSlice";
import Container from "../components/ui/Container";

const AvailableShippingMethods = () => {
    const { t } = useTranslation();
    const { currentData: shippingMethods}  = useGetShippingMethodsQuery();
    const ref = useFocus('/shipping')
    return (
        <Container className="flex flex-col items-left p-12">
            <h1 tabIndex="-1" ref={ref} className="text-2xl">{t('stuff:shippingMethods')}</h1>
            <section>
                <ul>
                    {Array.isArray(shippingMethods) && shippingMethods.map((method, index) =>(
                        <li key={index}>{`${method.shipping_name}: ${method.price}`}<span>{t('shop:price')}</span></li>
                    ))}
                </ul>
            </section>
        </Container>
    )
};

export default AvailableShippingMethods;