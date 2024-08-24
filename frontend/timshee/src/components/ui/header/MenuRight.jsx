import React from 'react';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentToken} from "../../../redux/features/store/authSlice";
import {clsx} from "clsx";
import MenuItemFlat from "./MenuItemFlat";
import {selectWishlistLength} from "../../../redux/features/store/storeSlice";
import {selectTotalQuantity} from "../../../redux/features/store/cartSlice";
import {useWindowSize} from "../../../lib/hooks";
import {toggleCartMenu} from "../../../redux/features/store/uiControlsSlice";
import {useLocation} from "react-router-dom";

export default function MenuRight() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);
    const cartItemsTotal = useSelector(selectTotalQuantity);
    const wishlistItemsTotal = useSelector(selectWishlistLength);
    const { width } = useWindowSize();

    const menuRight = [
        {
            title: t('header:shippingMethods'),
            url: '/shipping',
        },
        {
            title: t('header:account'),
            url: null,
            subMenu: token ? [
                {
                    title: t('header:account'),
                    url: '/account/details',
                },
                {
                    title: t('header:addressBook'),
                    url: '/account/details/addresses',
                },
                {
                    title: t('header:orders'),
                    url: '/account/details/orders',
                },
                {
                    title: t('header:wishlist'),
                    url: '/wishlist',
                    quantity: `(${wishlistItemsTotal})`,
                }
            ] : [
                {
                    title: t('header:signin'),
                    url: '/account/signin',
                },
                {
                    title: t('header:signup'),
                    url: '/account/signup',
                },
                {
                    title: t('header:wishlist'),
                    url: '/wishlist',
                    quantity: `(${wishlistItemsTotal})`
                }
            ]
        },
        {
            title: `${t('header:cart')} (${cartItemsTotal})`,
            url: (width > 1024 || pathname === '/cart') ? null : '/cart',
            action: () => dispatch(toggleCartMenu())
        }
    ];

    const menuItems = menuRight.map((item, index) =>
        <MenuItemFlat key={index} item={item} />
    );
    return (
        <nav>
            <ul className={clsx('w-full flex justify-end')}>{menuItems}</ul>
        </nav>
    )
}