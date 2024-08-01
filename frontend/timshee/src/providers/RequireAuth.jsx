import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import AccountProvider from "./AccountProvider";
import {useAuthContext} from "../lib/hooks";

const RequireAuth = ({ element: Element, ...rest }) => {
    const { token } = useAuthContext();

    if (token?.access) {
        return (
            <AccountProvider>
                <Outlet/>
            </AccountProvider>
        )
    } else {
        return <Navigate to="/account/signin"  />
    }
};

export default RequireAuth;