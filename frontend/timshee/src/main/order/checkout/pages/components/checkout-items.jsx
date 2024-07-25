import React, {useEffect} from 'react';
import t from "../../../../translate/TranslateService";
import { API_URL } from '../../../../../config';

import "./CheckoutItems.css";

const CheckoutItems = ({ cart }) => {
    const language = t.language();

    return (
        <>
            {cart.cartItems.map(item => (
                <div className="grid grid-cols-3 py-[10px] px-[30px]" key={item.stock.id}>
                    <div className="flex flex-col items-center p-1">
                        <img
                            src={`${API_URL}${item.stock.item.image}`}
                            alt={`alt-order-image-${item.stock.item.id}`}
                            className="sm:h-[128px] md:h-[192px] lg:h-[256px] shrink-0"
                        />

                    </div>
                    <div className="flex flex-col items-start p-1">
                        <div className="checkout-item-name">{item.stock.item.name}</div>
                        <div className="checkout-item-size">{item.stock.size.value}</div>
                        <div className="checkout-item-color">{item.stock.color.name}</div>
                        <div className="w-5 h-5 flex justify-center items-center bg-gray-500 text-white rounded-2xl text-xl"
                             style={{fontVariant: "all-small-caps"}}
                        >
                            <span>{item.quantity}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end p-1">
                        <span>{item.price}
                            <span>{t.shop.price[language]}</span>
                        </span>
                    </div>
                </div>
            ))}
        </>
    )
};

export default CheckoutItems;