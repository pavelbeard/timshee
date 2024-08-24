import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentToken} from "../../../redux/features/store/authSlice";
import MenuItemRecursive from "./MenuItemRecursive";
import {clsx} from "clsx";
import {toggleBurgerMenu} from "../../../redux/features/store/uiControlsSlice";
import {selectWishlistLength} from "../../../redux/features/store/storeSlice";
import {selectTotalQuantity} from "../../../redux/features/store/cartSlice";

export default function MenuRightRecursive({ className }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const token = useSelector(selectCurrentToken);
    const cartItemsTotal = useSelector(selectTotalQuantity);
    const wishlistItemsTotal = useSelector(selectWishlistLength);

    const menuRight = [
        {
            title: t('header:shippingMethods'),
            url: '/shipping',
            closeMenu: () => dispatch(toggleBurgerMenu(false)),
        },
        {
            title: t('header:account'),
            url: null,
            subMenu: token
                ? [
                    {
                        title: t('header:details'),
                        url: '/account/details',
                        closeMenu: () => dispatch(toggleBurgerMenu(false)),
                        close: true,
                        roboto: true
                    },
                    {
                        title: t('header:addressBook'),
                        url: '/account/details/addresses',
                        closeMenu: () => dispatch(toggleBurgerMenu(false)),
                        close: true,
                        roboto: true
                    },
                    {
                        title: t('header:orders'),
                        url: '/account/details/orders',
                        closeMenu: () => dispatch(toggleBurgerMenu(false)),
                        close: true,
                        roboto: true
                    },
                    {
                        title: `${t('header:wishlist')} (${wishlistItemsTotal})`,
                        url: '/wishlist',
                        closeMenu: () => dispatch(toggleBurgerMenu(false)),
                        close: true,
                        roboto: true
                    }
                ]
                :
                [
                    {
                        title: t('header:signin'),
                        url: '/account/signin',
                        closeMenu: () => dispatch(toggleBurgerMenu(false)),
                        close: true,
                        roboto: true
                    },
                    {
                        title: t('header:signup'),
                        url: '/account/signup',
                        closeMenu: () => dispatch(toggleBurgerMenu(false)),
                        close: true,
                        roboto: true
                    },
                    {
                        title: t('header:wishlist'),
                        url: '/wishlist',
                        closeMenu: () => dispatch(toggleBurgerMenu(false)),
                        close: true,
                        roboto: true
                    }
                ]
        },
        {
            title: `${t('header:cart')} (${cartItemsTotal})`,
            url: '/cart',
            closeMenu: () => dispatch(toggleBurgerMenu(false)),
        }
    ];

    const menuItems = menuRight.map((item, index) =>
        <MenuItemRecursive key={index} item={item} />
    );
    return <nav className={className}>
        <ul className={clsx('w-full')}>{menuItems}</ul>
    </nav>
}