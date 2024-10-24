import { clsx } from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useWindowSize } from "../../../lib/hooks";
import { selectCurrentToken } from "../../../redux/features/store/authSlice";
import { selectTotalQuantity } from "../../../redux/features/store/cartSlice";
import { selectWishlistLength } from "../../../redux/features/store/storeSlice";
import { toggleCartMenu } from "../../../redux/features/store/uiControlsSlice";
import MenuItemFlat from "./MenuItemFlat";

export default function MenuRight() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const token = useSelector(selectCurrentToken);
  const cartItemsTotal = useSelector(selectTotalQuantity);
  const wishlistItemsTotal = useSelector(selectWishlistLength);
  const { width } = useWindowSize();
  const menuRight = useMemo(
    () => [
      {
        title: t("header:shippingMethods"),
        url: "/shipping",
      },
      {
        title: t("header:account"),
        url: null,
        subMenu: token
          ? [
              {
                title: t("header:account"),
                url: "/account/details",
              },
              {
                title: t("header:addressBook"),
                url: "/account/details/addresses",
              },
              {
                title: t("header:orders"),
                url: "/account/details/orders",
              },
              {
                title: t("header:wishlist"),
                url: "/wishlist",
                quantity: `(${wishlistItemsTotal})`,
              },
            ]
          : [
              {
                title: t("header:signin"),
                url: "/account/signin",
              },
              {
                title: t("header:signup"),
                url: "/account/signup",
              },
              {
                title: t("header:wishlist"),
                url: "/wishlist",
                quantity: `(${wishlistItemsTotal})`,
              },
            ],
      },
      {
        title: `${t("header:cart")} (${cartItemsTotal})`,
        url: width > 1024 || pathname === "/cart" ? null : "/cart",
        action: () => dispatch(toggleCartMenu()),
      },
    ],
    [t, width, dispatch, token, pathname, wishlistItemsTotal, cartItemsTotal],
  );

  const menuItems = useMemo(
    () =>
      menuRight.map((item, index) => <MenuItemFlat key={index} item={item} />),
    [menuRight],
  );

  return (
    <nav>
      <ul className={clsx("w-full flex justify-end")}>{menuItems}</ul>
    </nav>
  );
}
