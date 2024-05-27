import Main from "./main/Main.js";
import {Provider, useDispatch} from "react-redux";
import store from "./redux/store";
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
import TestComponent from "./test/TestComponent";
import OrderPaid from "./main/order/OrderPaid";
import EditAddressForm from "./main/account/forms/EditAddressForm";
import Orders from "./main/account/Orders";
import OrderIsNotPaid from "./main/order/OrderIsNotPaid";
import OrderCheckPayment from "./main/order/OrderCheckPayment";
import OrderDetail from "./main/account/OrderDetail";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
    const [collectionLinks, setCollectionLinks] = useState([]);

    const getCsrfToken = async () => {
        try {
            await fetch(API_URL + "api/stuff/get-csrf-token/", {
                credentials: "include",
            });
        } catch (e) {
            // console.error(e);
        }
    }

    const getCollectionLinks = async () => {
        try {
            const response = await fetch(API_URL + "api/store/collections/", {
                credentials: "include",
            });
            const json = await response.json();
            setCollectionLinks(json);
        } catch (e) {

        }
    }

    useEffect(() => {
        getCsrfToken();
        getCollectionLinks();
    }, []);

    return(
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/shop/:collection/:gender" element={<Shop />} />
                        <Route path="/shop/:collection/:type/:itemId/:itemName" element={<ItemCardDetail />} />
                        <Route path="/shop/page/:page" element={<Shop />} />
                        <Route path="/account/address-book" element={<Addresses />} />
                        <Route path="/account/login" element={<Login />} />
                        <Route path="/account/register" element={<Register />} />
                        <Route path="/account/details" element={<Account />} />
                        <Route path="/account/details/addresses" element={<Addresses />} />
                        <Route path="/account/details/orders" element={<Orders />} />
                        <Route path="/account/details/orders/:orderId/detail" element={<OrderDetail />} />
                        {
                            typeof collectionLinks.map === "function" && collectionLinks.map((item, index) => {
                                return (
                                    <Route
                                        path={`/collections/${item.link}`}
                                        key={index}
                                        element={ <Shop collectionId={item.id} collectionName={item.name} />}
                                    />
                                )
                            })
                        }
                        <Route path="/shop/:orderId/checkout/order-check/:orderNumber" element={<OrderCheckPayment />} />
                        <Route path="/shop/:orderId/checkout/order-paid/:orderNumber" element={<OrderPaid />} />
                        <Route path="/shop/:orderId/checkout/order-failed/:orderNumber" element={<OrderIsNotPaid />} />
                    </Route>
                    <Route path="/shop/:orderId/checkout" element={<Checkout />} />
                    <Route path="/shop/:orderId/checkout/:step" element={<Checkout />} />
                    <Route path="/test" element={<TestComponent />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App;