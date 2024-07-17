import React, {useEffect} from 'react';

import "./CheckoutItems.css";
import t from "../../../../translate/TranslateService";

import { API_URL } from '../../../../../config';

const CheckoutItems = ({ cart }) => {
    const language = t.language();
    const [imageSize, setImageSize] = React.useState(100);

    useEffect(() => {
        const mobileWidth = () => {
            const width = window.innerWidth;

            if (width <= 400) {
                setImageSize(40);
            } else if (width <= 760) {
                setImageSize(80);
            } else {
                setImageSize(100);
            }
        }

        mobileWidth();
        window.addEventListener("resize", mobileWidth);
        return () => window.removeEventListener("resize", mobileWidth);
    }, []);

    return (
        <>
            {cart.cartItems.map(item => (
                <div className="checkout-item-container" key={item.stock.id}>
                    <div className="checkout-item-image">
                        <img src={`${API_URL}${item.stock.item.image}`} alt={`alt-order-image-${
                            item.stock.item.id
                        }`} height={imageSize}/>
                        <div className="checkout-item-quantity">
                            <span>{item.quantity}</span>
                        </div>
                    </div>
                    <div className="checkout-item-info">
                    <div className="checkout-item-name">{item.stock.item.name}</div>
                        <div className="checkout-item-size">{item.stock.size.value}</div>
                        <div className="checkout-item-color">{item.stock.color.name}</div>
                    </div>
                    <div className="checkout-item-price">
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