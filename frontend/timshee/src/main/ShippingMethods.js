import React from 'react';
import t from "../main/translate/TranslateService";

const ShippingMethods = () => {
    const language = t.language();
    return (
        <div style={{padding: "0 2rem 5rem"}}>
            <h1>Способы доставки:</h1>
            <section>
                <ul>
                    <li>Самовывоз: бесплатно</li>
                    <li>Курьер: 1500 <span>{t.shop.price[language]}</span></li>
                    <li>СДЭК: 1500 <span>{t.shop.price[language]}</span></li>
                </ul>
            </section>
        </div>
    )
};

export default ShippingMethods;