import React, {createContext, useEffect, useState} from "react";
import AuthService from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(AuthService.getCurrentUser());

    useEffect(() => {
        const storedUser = AuthService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const register = async ({firstName, lastName, email, password, setErrorMessage}) => {
        const data = AuthService.register({firstName, lastName, email, password, setErrorMessage});
        setUser(data);
        return data;
    };

    const login = async ({ email, password, setErrorMessage }) => {
        const data = await AuthService.login({ email, password, setErrorMessage });
        setUser(data);
        return data;
    };

    const logout = async () => {
        AuthService.logout();
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;