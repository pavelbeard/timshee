import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import Loading from "../techPages/loading";
import { useAuthentication } from "../../lib/global/hooks";

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { isVerified, isRefreshed, isLoading, token } = useAuthentication();

    if (isLoading) {
        return <Loading />
    } else if ((isVerified || isRefreshed) && token) {
        return <Outlet />
    } else {
        return <Navigate to="/account/signin"/>
    }
    // if (token?.access) {
    //     return <Outlet />
    // } else {
    //     return <Navigate to="/account/signin" />
    // }
};

export default PrivateRoute;