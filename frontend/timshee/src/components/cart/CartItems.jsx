import {useSelector} from "react-redux";
import {selectCartItems} from "../../redux/features/store/cartSlice";
import CartItem from "./CartItem";
import React from "react";
import {useTranslation} from "react-i18next";
import {useClearCartMutation} from "../../redux/features/api/cartApiSlice";
import {useLocation} from "react-router-dom";
import {clsx} from "clsx";

export default function CartItems() {
    const { t } = useTranslation();
    const cartItems = useSelector(selectCartItems);
    const { pathname } = useLocation();
    const cartItemsHTML = cartItems?.map((cartItem, idx) => (
        <CartItem key={idx} cartItem={cartItem} />
    ));

    const [ClearCartMut] = useClearCartMutation();

    const clear = () => {
        ClearCartMut().unwrap();
    }

    return (
        <section className={clsx(pathname === '/cart'
            ? 'min-h-screen'
            : 'lg:h-[25rem]',
            'overflow-y-auto'
        )}>
            <div className={clsx(
                pathname === 'cart' && 'lg:grid lg:grid-cols-2'
            )}>{cartItemsHTML}</div>
            <div className="px-6 pb-2" data-clear-cart="">
                <button onClick={clear} className="underlined-button">{t('cart:removeAll')}</button>
            </div>
        </section>
    );
}