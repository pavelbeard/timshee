import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";

import CartItems from "./components/cart-items";
import t from "../../translate/TranslateService";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {clsx} from "clsx";
import {useCartStore} from "../../../store";
import {useTranslation} from "react-i18next";

const cartContainer = clsx(
    'bg-white absolute right-0'
);

const cartContainerMaxSm = clsx(
    cartContainer,
    'max-sm:w-full max-sm:min-h-full',
);

const cartContainerMd = clsx(
    'md:w-[49%] md:min-h-full',
)

const Cart = () => {
    window.document.title = "Cart | Timshee";
    const {
        cartItems, orderId, totalPrice, isCartMenuOpen, getCartItems,
        toggleCartMenu,
    } = useCartStore();

    useEffect(() => {
        (async () => {
            await getCartItems();
        })();
    }, []);

    const isCartFull = Array.isArray(cartItems) && cartItems.length > 0;

    return (
        <div className={clsx(cartContainerMaxSm, cartContainerMd, isCartMenuOpen && 'z-[150]')}>
            <CartHeader toggleCartMenu={toggleCartMenu}/>
            {isCartFull && <CartItems />}
            {isCartFull && <CartBody cartItems={cartItems} orderId={orderId} totalPrice={totalPrice} />}
            {!isCartFull && <CartIsEmpty />}
        </div>
    )

    // if (!isCartMenuOpen) {
    //     return cartBody();
    // } else {
    //     return (
    //         <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-end">
    //             <div className="max-md:hidden bg-gray-500 opacity-75 w-3/5" onClick={toggleCartMenu}></div>
    //             {cartBody()}
    //         </div>
    //     )
    // }
};

export default Cart;

function CartHeader(props) {
    const { t } = useTranslation();
    const { toggleCartMenu } = props;
    return (
        <div className="flex justify-between items-center py-[15px] px-[30px] border-b-[1px]">
            <div className="text-2xl tracking-wider">{t('cart:yourCart')}</div>
            {<XMarkIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => toggleCartMenu({forced: true})}
            />}
        </div>
    )
}

function CartBody(props) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { totalPrice, cartItems, orderId } = props;
    const [isPrivacyHaveRead, setIsPrivacyHaveRead] = React.useState(false);

    const checkout = () => {
        if (cartItems.length > 0 && isPrivacyHaveRead) {
            navigate(`/shop/${orderId}/checkout`);
        }
    };

    return (
        <div className="flex flex-col border-t-[1px] bg-white">
            <div></div>
            <div className="py-[15px] px-[30px]">
                <div>{t('cart:taxesAndShipping')}</div>
                <label>
                    <input id="privacy" checked={isPrivacyHaveRead} type="checkbox"
                           onChange={e => setIsPrivacyHaveRead(e.target.checked)}/>
                    <span>
                        {t('cart:privacy')}
                        <Link to={`/privacy-information`}>
                            <span className="pl-1 underline underline-offset-2">
                                {t('cart:privacy')}
                            </span>
                        </Link>
                        </span>
                </label>
            </div>
            <button
                className={clsx(
                    'm-6',
                    'py-[10px] px-[20px] tracking-widest',
                    'hover:bg-black hover:text-white',
                    'border-[1px] border-black',
                    !isPrivacyHaveRead &&
                    'cursor-not-allowed bg-gray-900 text-gray-400 opacity-50 tracking-widest',
                )}
                onClick={checkout}>
                {t('cart:checkout')} • {totalPrice}<span>{t('shop:price')}</span>
            </button>
        </div>
    )
}

function CartIsEmpty(props) {
    const { t } = useTranslation();
    return (
        <div className="pt-12 flex justify-center items-center">
            <h1>{t('cart:cartIsEmpty')}</h1>
        </div>
    )
}