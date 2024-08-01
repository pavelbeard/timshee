import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/layout/Layout.jsx";
import Shop from "./pages/shop/Shop";
import SignIn from "./pages/account/SignIn";
import SignUp from "./pages/account/SignUp";
import Account from "./pages/account/Account";
import Addresses from "./pages/account/details/addresses/Addresses";
import ItemDetail from "./pages/shop/detail/ItemDetail";
import NotFound from "./pages/NotFound";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/orders/checkout/Checkout";
import OrderPaid from "./pages/orders/status/OrderPaid";
import Orders from "./pages/account/details/orders/Orders";
import OrderIsNotPaid from "./pages/orders/status/OrderIsNotPaid";
import OrderCheckPayment from "./pages/orders/status/OrderCheckPayment";
import OrderDetail from "./pages/orders/detail/OrderDetail";
import RequireAuth from "./providers/RequireAuth";
import OrderRefund from "./pages/orders/refund/OrderRefund";
import Error from "./pages/Error";
import PrivacyInfo from "./pages/PrivacyInfo";
import Wishlist from "./pages/wishlist/Wishlist";
import Offer from "./pages/Offer";
import Contacts from "./pages/Contacts";
import AvailableShippingMethods from "./pages/AvailableShippingMethods";
import OnMaintenance from "./pages/OnMaintenance";
import OnContentUpdate from "./pages/OnContentUpdate";
import Request from "./pages/account/password/reset/Request";
import Reset from "./pages/account/password/reset/Reset";
import ConfirmEmail from "./pages/account/details/profile/verification/ConfirmEmail";
import About from "./pages/About";
import House from "./pages/House";
import Loading from "./pages/Loading";
import {useQuery} from "react-query";
import Profile from "./pages/account/details/profile/Profile";
import SendMailsProvider from "./providers/SendMailsProvider";
import PersistJWTSession from "./providers/PersistJWTSession";
import {privateApi} from "./lib/api";
import {useShopContext} from "./lib/hooks";

export default function Core() {
    const { setCollectionLinks } = useShopContext();
    const { isLoading, data, error } = useQuery({
        queryKey: ['initial'],
        queryFn: async () => {
            const [dynamicSettings, collectionLinks] = await Promise.all([
                privateApi.get('/api/stuff/settings'),
                privateApi.get('/api/store/collections'),
            ])
            return { dynamicSettings, collectionLinks };
        }
    });

    useEffect(() => {
        if (data?.collectionLinks) {
            setCollectionLinks(data.collectionLinks);
        }
    }, []);

    if (isLoading) {
        return <Loading />;
    } else if (data?.dynamicSettings?.onContentUpdate){
        return <OnContentUpdate />
    } else if (data?.dynamicSettings?.onMaintenance) {
        return <OnMaintenance />
    } else if (data?.collectionLinks) {
        return (
            <SendMailsProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="" element={<Layout/>}>
                            {/*PUBLIC ROUTES*/}
                            <Route path="/about" element={<About/>} />
                            <Route path="/house" element={<House/>} />
                            <Route path="/cart" element={<Cart/>}/>
                            <Route path="/wishlist" element={<Wishlist/>}/>
                            <Route path="/privacy" element={<PrivacyInfo/>}/>
                            <Route path="/offer" element={<Offer/>}/>
                            <Route path="/contacts" element={<Contacts/>}/>
                            <Route path="/shipping" element={<AvailableShippingMethods/>}/>
                            <Route path="/shop" element={<Shop />} />
                            {/*<Route path="/shop/collections/:c" element={<Shop/>}/>*/}
                            {/*<Route path="/shop/collections/:c/page/:page" element={<Shop/>}/>*/}
                            {/*<Route path="/shop/collections/:c/:type/:itemId/:itemName" element={<ItemDetail/>}/>*/}
                            <Route path="/account/signin" element={<SignIn/>}/>
                            <Route path="/account/signup" element={<SignUp/>}/>
                            <Route path="/account/password/reset/request" element={<Request/>}/>
                            <Route path="/account/password/reset/:token" element={<Reset/>}/>
                            {/*PRIVATE ROUTES*/}
                            <Route element={<PersistJWTSession />}>
                                <Route element={<RequireAuth/>}>
                                    <Route path="/account/details" element={<Account/>}/>
                                    <Route path="/account/details/profile" element={<Profile />}/>
                                    <Route path="/account/details/profile/verification/:token" element={<ConfirmEmail/>}/>
                                    <Route path="/account/details/addresses" element={<Addresses/>}/>
                                    <Route path="/account/details/orders" element={<Orders/>}/>
                                </Route>
                            </Route>
                            {/*PUBLIC ROUTES*/}
                            <Route path="/orders/:orderId/detail" element={<OrderDetail/>}/>
                            <Route path="/orders/:orderId/refund" element={<OrderRefund/>}/>
                            {/*<Route path="/orders/:orderId/refund/:stockItemId/:stockItemQuantity" element={<OrderRefund/>}/>*/}
                            {/*{Array.isArray(data.collectionLinks) && data.collectionLinks.map((item, index) => {*/}
                            {/*    return (*/}
                            {/*        <Route*/}
                            {/*            path={`/collections/${item.link}`}*/}
                            {/*            key={index}*/}
                            {/*            element={<Shop collectionId={item.id} collectionName={item.name}/>}*/}
                            {/*        />*/}
                            {/*    )*/}
                            {/*})}*/}
                            <Route path="/order/:orderId/checkout" element={<Checkout/>}/>
                            <Route path="/orders/:orderId/status/check" element={<OrderCheckPayment/>}/>
                            <Route path="/orders/:orderId/status/paid" element={<OrderPaid/>}/>
                            <Route path="/orders/:orderId/status/failed" element={<OrderIsNotPaid/>}/>
                        </Route>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </SendMailsProvider>
        )
    } else {
        return <Error />
    }
}