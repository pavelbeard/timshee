import React, {useEffect} from 'react';

import "./CheckoutItems.css";

const API_URL = process.env.REACT_APP_API_URL;

const CheckoutItems = () => {
    const [checkoutItems, setCheckoutItems] = React.useState([]);
    const [imageSize, setImageSize] = React.useState(100);

    useEffect(() => {
        if (checkoutItems.length === 0) {
            setCheckoutItems(JSON.parse(localStorage.getItem('order'))['ordered_items']['data']);
        }
    }, []);

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
            {checkoutItems.length > 0 && checkoutItems.map(item => (
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
                        <span>{item.price}</span>
                    </div>
                </div>
            ))}
        </>
    )
};

export default CheckoutItems;