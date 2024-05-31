import React, {useContext} from "react";
import AuthContext from "./AuthProvider";
import {Route, Navigate, Outlet} from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
    const user = useContext(AuthContext);

    return user ? <Outlet /> : <Navigate to="/login" />;

};

export default PrivateRoute;