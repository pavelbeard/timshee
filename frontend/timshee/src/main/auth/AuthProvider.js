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

    const register = async ({first_name, last_name, username, password, password2}) => {
        await AuthService.register({first_name, last_name, username, password, password2});
        return true;
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