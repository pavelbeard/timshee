import React, {useEffect} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";
import RequireAuth from "./providers/RequireAuth";
import {useDispatch} from "react-redux";
import publicRoutes from "./routes/publicRoutes";
import {privateRoutes} from "./routes/privateRoutes";
import {useTranslation} from "react-i18next";
import {shopRoutes} from "./routes/shopRoutes";
import {checkoutRoute} from "./routes/checkoutRoute";
import {initOrderBy} from "./redux/features/store/storeSlice";
import {useLazyGetWishlistByUserQuery} from "./redux/features/api/storeApiSlice";
import {useLazyGetCartItemsQuery} from "./redux/features/api/cartApiSlice";
import Redirect from "./pages/Redirect";

export default function Core() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [triggerWishlist] = useLazyGetWishlistByUserQuery();
    const [triggerCartItems] = useLazyGetCartItemsQuery();

    const initOrderByArr = () => {
        const initOrderByArray = [
            { value: "", name: '---', selected: true },
            { value: "name", name: t('shop:byNameAZ'), selected: false },
            { value: "-name", name: t('shop:byNameZA'), selected: false },
            { value: "price", name: t('shop:ascending'), selected: false },
            { value: "-price", name: t('shop:descending'), selected: false },
        ];

        dispatch(initOrderBy(initOrderByArray));
    };

    const callByTrigger = () => {
        triggerWishlist().unwrap().catch((err) => console.error(err));
        triggerCartItems().unwrap().catch((err) => console.error(err));
    };

    useEffect(() => {
        initOrderByArr();
        callByTrigger();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={"women/home"}/>} />
                <Route path="/*" element={<Layout/>}>
                    {publicRoutes.map((route, index) =>
                        <Route key={index} path={route.path} element={route.element} />
                    )}
                    {shopRoutes.map((route, index) =>
                        <Route key={index} path={route.path} element={route.element} />
                    )}
                    <Route element={<RequireAuth />}>
                        {privateRoutes.map((route, index) =>
                            <Route key={index} path={route.path} element={route.element} />
                        )}
                    </Route>
                    <Route path="not-found" element={<NotFound/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
                <Route path="checkout">
                    {checkoutRoute.map((route, index) =>
                        <Route key={index} path={route.path} element={route.element} />
                    )}
                </Route>
                <Route path="/redirect" element={<Redirect />} />
            </Routes>
        </BrowserRouter>
    )
}