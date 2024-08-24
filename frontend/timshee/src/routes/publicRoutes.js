import About from "../pages/About";
import House from "../pages/House";
import CartModal from "../pages/cart/CartModal";
import Wishlist from "../pages/Wishlist";
import PrivacyInfo from "../pages/PrivacyInfo";
import Offer from "../pages/Offer";
import Contacts from "../pages/Contacts";
import AvailableShippingMethods from "../pages/AvailableShippingMethods";
import SignIn from "../pages/account/SignIn";
import SignUp from "../pages/account/SignUp";
import Request from "../pages/account/password/reset/Request";
import Reset from "../pages/account/password/reset/Reset";
import React from "react";
import OrderDetail from "../pages/orders/detail/OrderDetail";
import OrderRefund from "../pages/orders/refund/OrderRefund";
import OrderCheckPayment from "../pages/orders/status/OrderCheckPayment";
import OrderPaid from "../pages/orders/status/OrderPaid";
import OrderIsNotPaid from "../pages/orders/status/OrderIsNotPaid";
import WelcomePage from "../pages/WelcomePage";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/orders/checkout/Checkout";

const publicRoutes = [
    { path: '', element: <WelcomePage /> },
    { path: 'about', element: <About /> },
    { path: 'house', element: <House /> },
    { path: 'cart', element: <Cart /> },
    { path: 'wishlist', element: <Wishlist /> },
    { path: 'privacy', element: <PrivacyInfo /> },
    { path: 'offer', element: <Offer /> },
    { path: 'contacts', element: <Contacts /> },
    { path: 'shipping', element: <AvailableShippingMethods /> },
    { path: 'account/signin', element: <SignIn /> },
    { path: 'account/signup', element: <SignUp /> },
    { path: 'account/password/reset/request', element: <Request /> },
    { path: 'account/password/reset/:token', element: <Reset /> },
    { path: 'orders/:orderId/detail', element: <OrderDetail /> },
    { path: 'orders/:orderId/refund', element: <OrderRefund /> },
    { path: 'orders/:orderId/status/check', element: <OrderCheckPayment /> },
    { path: 'orders/:orderId/status/paid', element: <OrderPaid /> },
    { path: 'orders/:orderId/status/failed', element: <OrderIsNotPaid /> },
];

export default publicRoutes;