import React, {useEffect, useState} from "react";
import {useAuthContext, useRefreshToken} from "../lib/hooks";
import Loading from "../pages/Loading";
import {Outlet} from "react-router-dom";

export default function PersistJWTSession() {
    const [isLoading, setIsLoading] = useState(true);
    const refreshToken = useRefreshToken();
    const { token } = useAuthContext();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refreshToken();
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false);
            }
        }

        !token?.access ? verifyRefreshToken() : setIsLoading(false);
    }, [])

    if (isLoading) {
        return <Loading />;
    } else {
        return <Outlet />
    }
}