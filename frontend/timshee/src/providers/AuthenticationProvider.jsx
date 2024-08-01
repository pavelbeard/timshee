import {createContext,  useState} from "react";

export const  AuthenticationContext = createContext(null);

export default function AuthenticationProvider({ children }) {
    const [token, setToken] = useState({
        access: ""
    });

    return (
        <AuthenticationContext.Provider value={{ token, setToken }}>
            {children}
        </AuthenticationContext.Provider>
    )
}