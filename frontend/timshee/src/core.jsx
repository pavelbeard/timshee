import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Container from "./main/container.jsx";
import Shop from "./main/shop/pages/shop";
import Signin from "./main/account/pages/auth/signin/signin";
import Signup from "./main/account/pages/auth/signup/signup";
import Account from "./main/account/pages/account";
import AddressesPage from "./main/account/pages/addresses/addresses-page";
import ItemCardDetail from "./main/shop/pages/components/item-card-detail";
import NotFound from "./not-found";
import Cart from "./main/cart/pages/cart";
import Checkout from "./main/order/checkout/pages/checkout";
import OrderPaid from "./main/order/orderStatus/pages/components/orderPaid/OrderPaid";
import Orders from "./main/account/pages/orders/orders";
import OrderIsNotPaid from "./main/order/orderStatus/pages/components/orderIsNotPaid/OrderIsNotPaid";
import OrderCheckPayment from "./main/order/orderStatus/pages/OrderCheckPayment";
import OrderDetail from "./main/account/pages/orders/components/order-detail";
import PrivateRoute from "./main/auth/private-route";
import OrderRefund from "./main/account/pages/orders/components/OrderRefund";
import Error from "./main/techPages/error";
import PrivacyInfo from "./main/techPages/privacy-info";
import Wishlist from "./main/account/pages/wishlist/wishlist";
import {TranslateProvider} from "./main/translate/TranslateProvider";
import StartPage from "./main/techPages/start-page";
import Offer from "./main/techPages/offer";
import Contacts from "./main/techPages/contacts";
import ShippingMethods from "./main/techPages/shipping-methods";
import OnMaintenance from "./main/techPages/on-maintenance";
import OnContentUpdate from "./main/techPages/on-content-update";
import SendEmailForm from "./main/account/pages/auth/signin/forms/send-email-form";
import NewPasswordForm from "./main/account/pages/auth/signin/forms/new-password-form";
import ConfirmEmail from "./main/account/pages/confirm-email/confirm-email";
import About from "./about";
import House from "./house";
import {useGlobalStore, useOrderStore, useShopStore} from "./store";
import {useToken} from "./lib/global/hooks";

export default function Core() {
    const token = useToken();
    const shopStore = useShopStore();
    const globalStore = useGlobalStore();
    const orderStore = useOrderStore();

    useEffect(() => {
        (async () => {
            await shopStore.getCollectionLinks();
            await shopStore.getCategories();
            await globalStore.getProvinces();
            await globalStore.getPhoneCodes();
            await globalStore.getDynamicSettings(token);
            await orderStore.getShippingMethods(token);
        })();
    }, []);

    const lengths = shopStore.collectionLinks.length > 0
        && shopStore.categories.length > 0
        && globalStore.provinces.length > 0
        && globalStore.phoneCodes.length > 0
        && orderStore.shippingMethods.length > 0;

    if (globalStore.dynamicSettings?.onContentUpdate){
        return <OnContentUpdate />
    } else if (globalStore.dynamicSettings?.onMaintenance) {
        return <OnMaintenance />
    } else if (lengths) {
        return (
            <TranslateProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="" element={<Container/>}>
                            <Route path="/about" element={<About/>} />
                            <Route path="/house" element={<House/>} />
                            <Route path="/cart" element={<Cart/>}/>
                            <Route path="/shop/collections/:c" element={<Shop/>}/>
                            <Route path="/shop/collections/:c/page/:page" element={<Shop/>}/>
                            <Route path="/shop/collections/:c/:type/:itemId/:itemName"
                                   element={<ItemCardDetail/>}/>
                            <Route path="/account/signin" element={<Signin/>}/>
                            <Route path="/account/password/reset/send-email" element={<SendEmailForm/>}/>
                            <Route path="/account/password/reset/:uuid/" element={<NewPasswordForm/>}/>
                            <Route path="/account/signup" element={<Signup/>}/>
                            <Route element={<PrivateRoute/>}>
                                <Route path="/account/confirm-email/:encodedEmail" element={<ConfirmEmail/>}/>
                                <Route path="/account/details" element={<Account/>}/>
                                <Route path="/account/details/addresses" element={<AddressesPage/>}/>
                                <Route path="/account/details/orders" element={<Orders/>}/>
                            </Route>
                            <Route path="/account/details/wishlist" element={<Wishlist/>}/>
                            <Route path="/orders/:orderId/detail" element={<OrderDetail/>}/>
                            <Route path="/orders/:orderId/order-refund" element={<OrderRefund/>}/>
                            <Route path="/orders/:orderId/order-refund/:stockItemId/:stockItemQuantity"
                                   element={<OrderRefund/>}/>
                            {Array.isArray(shopStore.collectionLinks) && shopStore.collectionLinks.map((item, index) => {
                                return (
                                    <Route
                                        path={`/collections/${item.link}`}
                                        key={index}
                                        element={<Shop collectionId={item.id} collectionName={item.name}/>}
                                    />
                                )
                            })}
                            <Route path="/shop/:orderId/checkout/order-check/:orderNumber"
                                   element={<OrderCheckPayment/>}/>
                            <Route path="/shop/:orderId/checkout/order-paid/:orderNumber"
                                   element={<OrderPaid/>}/>
                            <Route path="/shop/:orderId/checkout/order-failed/:orderNumber"
                                   element={<OrderIsNotPaid/>}/>
                            <Route path="/privacy-information" element={<PrivacyInfo/>}/>
                            <Route path="/offer" element={<Offer/>}/>
                            <Route path="/contacts" element={<Contacts/>}/>
                            <Route path="/shipping-methods" element={<ShippingMethods/>}/>
                        </Route>
                        <Route path="/shop/:orderId/checkout" element={<Checkout/>}/>
                        <Route path="/shop/:orderId/checkout/:step" element={<Checkout/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </TranslateProvider>
        )
    } else if (!lengths) {
        return <StartPage />
    } else {
        return <Error />
    }
}