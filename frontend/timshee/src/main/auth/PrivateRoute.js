import React from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../redux/services/features/auth/authSlice";

const PrivateRoute = ({ element: Element, ...rest }) => {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();

    if (token) {
        return <Outlet />
    } else {
        return <Navigate to="/account/login" state={{ from: location }} replace />
    }
};

export default PrivateRoute;