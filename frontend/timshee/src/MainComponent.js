import Main from "./main/Main.js";
import {useDispatch, useSelector} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Shop from "./main/shop/Shop";
import React, {useEffect, useState} from "react";
import Login from "./main/account/Login";
import Register from "./main/account/Register";
import Account from "./main/account/Account";
import Addresses from "./main/account/Addresses";
import ItemCardDetail from "./main/shop/ItemCardDetail";
import NotFound from "./NotFound";
import Cart from "./main/cart/Cart";
import Checkout from "./main/order/Checkout";
// import TestComponent from "./test/TestComponent";
import OrderPaid from "./main/order/OrderPaid";
import Orders from "./main/account/Orders";
import OrderIsNotPaid from "./main/order/OrderIsNotPaid";
import OrderCheckPayment from "./main/order/OrderCheckPayment";
import OrderDetail from "./main/account/OrderDetail";

import {AuthProvider} from "./main/auth/AuthProvider";
import PrivateRoute from "./main/auth/PrivateRoute";
import OrderRefund from "./main/account/OrderRefund";
import {getCategories, getCollectionLinks, getCountries, getCsrfToken} from "./redux/slices/appSlice";
import Loading from "./main/Loading";
import Error from "./main/Error";
import PrivacyInfo from "./main/PrivacyInfo";
import Wishlist from "./main/account/Wishlist";
import {TranslateProvider} from "./main/translate/TranslateProvider";
import StartPage from "./main/StartPage";
import {getPhoneCodes, getProvinces} from "./main/account/forms/reducers/asyncThunks";
import {getShippingMethods} from "./main/order/api/asyncThunks";
import ChangeEmailForm from "./main/account/forms/ChangeEmailForm";

const MainComponent = () => {
    const dispatch = useDispatch();
    const {collections: collectionLinks, categories, collectionsStatus} = useSelector(state => state.app);
    const {provinces, phoneCodes} = useSelector(state => state.addressForm);
    const {shippingMethods} = useSelector(state => state.shippingAddressForm);

    useEffect(() => {
        dispatch(getCsrfToken());
        dispatch(getCollectionLinks());
        dispatch(getCategories());
        dispatch(getCountries());
        dispatch(getProvinces());
        dispatch(getPhoneCodes());
        dispatch(getShippingMethods());
    }, []);

    if (collectionsStatus === 'success'
        && collectionLinks.length > 0
        && categories.length > 0
        && provinces.length > 0
        && phoneCodes.length > 0
        && shippingMethods.length > 0
    ) {
        return (
            <TranslateProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="" element={<Main/>} >
                                <Route path="/cart" element={<Cart/>}/>
                                <Route path="/shop/collections/:c" element={<Shop />}/>
                                <Route path="/shop/collections/:c/page/:page" element={<Shop />}/>
                                <Route path="/shop/collections/:c/:type/:itemId/:itemName" element={<ItemCardDetail />}/>
                                <Route path="/account/login" element={<Login/>}/>
                                <Route path="/account/register" element={<Register/>}/>
                                <Route element={<PrivateRoute/>}>
                                    <Route path="/account/details" element={<Account/>}/>
                                    <Route path="/account/details/addresses" element={<Addresses/>}/>
                                    <Route path="/account/details/orders" element={<Orders/>}/>
                                </Route>
                                <Route path="/account/details/wishlist" element={<Wishlist />}/>
                                <Route path="/orders/:orderId/detail" element={<OrderDetail/>}/>
                                <Route path="/orders/:orderId/order-refund" element={<OrderRefund/>}/>
                                <Route path="/orders/:orderId/order-refund/:stockItemId/:stockItemQuantity" element={<OrderRefund/>}/>
                                {
                                    typeof collectionLinks.map === "function" && collectionLinks.map((item, index) => {
                                        return (
                                            <Route
                                                path={`/collections/${item.link}`}
                                                key={index}
                                                element={<Shop collectionId={item.id} collectionName={item.name}/>}
                                            />
                                        )
                                    })
                                }
                                <Route path="/shop/:orderId/checkout/order-check/:orderNumber"
                                       element={<OrderCheckPayment/>}/>
                                <Route path="/shop/:orderId/checkout/order-paid/:orderNumber" element={<OrderPaid/>}/>
                                <Route path="/shop/:orderId/checkout/order-failed/:orderNumber"
                                       element={<OrderIsNotPaid/>}/>
                                <Route path="/privacy-information" element={<PrivacyInfo />} />
                            </Route>
                            <Route path="/shop/:orderId/checkout" element={<Checkout/>}/>
                            <Route path="/shop/:orderId/checkout/:step" element={<Checkout/>}/>
                            {/*<Route path="/test" element={<TestComponent/>}/>*/}
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </TranslateProvider>
        )
    } else if (collectionsStatus === 'loading') {
        return <Loading />;
    } else if (collectionsStatus === 'error') {
        return <Error />;
    } else {
        return <StartPage />;
    }
};

export default MainComponent;