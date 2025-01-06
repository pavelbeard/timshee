import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./lib/hooks";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";
import Redirect from "./pages/Redirect";
import RequireAuth from "./providers/RequireAuth";
import { useLazyGetCartItemsQuery } from "./redux/features/api/cartApiSlice";
import { useLazyGetWishlistByUserQuery } from "./redux/features/api/storeApiSlice";
import { initOrderBy } from "./redux/features/store/storeSlice";
import { checkoutRoute } from "./routes/checkoutRoute";
import { privateRoutes } from "./routes/privateRoutes";
import publicRoutes from "./routes/publicRoutes";
import { shopRoutes } from "./routes/shopRoutes";

export default function Core() {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();
  const [triggerWishlist] = useLazyGetWishlistByUserQuery();
  const [triggerCartItems] = useLazyGetCartItemsQuery();

  const initOrderByArr = useCallback(() => {
    const initOrderByArray = [
      { value: "", name: "---", selected: true },
      { value: "name", name: t("shop:byNameAZ"), selected: false },
      { value: "-name", name: t("shop:byNameZA"), selected: false },
      { value: "price", name: t("shop:ascending"), selected: false },
      { value: "-price", name: t("shop:descending"), selected: false },
    ];

    dispatch(initOrderBy(initOrderByArray));
  }, [dispatch, t]);

  const callByTrigger = useCallback(() => {
    triggerWishlist()
      .unwrap()
      .catch(() => null);
    triggerCartItems()
      .unwrap()
      .catch(() => null);
  }, [triggerWishlist, triggerCartItems]);

  // const changeLang = async () => {
  //   if (typeof i18n.changeLanguage === "function") {
  //     await i18n.changeLanguage("ru");
  //   }
  // };

  // useEffect(() => {
  //   changeLang();
  // }, [i18n.isInitialized]);

  useEffect(() => {
    if (i18n.isInitialized) {
      initOrderByArr();
    }
    callByTrigger();
  }, [i18n.isInitialized]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"women/home"} />} />
        <Route path="/*" element={<Layout />}>
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {shopRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          <Route element={<RequireAuth />}>
            {privateRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
          <Route path="not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="checkout">
          {checkoutRoute.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="/redirect" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  );
}
