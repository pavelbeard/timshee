import React from "react";
import AccountDetails from "../pages/account/Account";
import Profile from "../pages/account/details/profile/Profile";
import ConfirmEmail from "../pages/account/details/profile/verification/ConfirmEmail";
import Addresses from "../pages/account/details/Addresses";
import Orders from "../pages/account/details/Orders";

export const privateRoutes = [
    { path: "account/details", element: <AccountDetails /> },
    { path: "account/details/profile", element: <Profile /> },
    { path: "account/details/profile/verification/:token", element: <ConfirmEmail /> },
    { path: "account/details/addresses", element: <Addresses /> },
    { path: "account/details/orders", element: <Orders /> },
    { path: "account/confirm-email", element: <ConfirmEmail /> }
];