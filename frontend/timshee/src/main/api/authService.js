import {API_URL, CSRF_TOKEN} from '../../config';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

const register = async ({first_name, last_name, username, password, password2}) => {
    try {
        const response = await fetch(API_URL + "/api/stuff/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": CSRF_TOKEN,
            },
            body: JSON.stringify({
                first_name,
                last_name,
                username,
                password,
                password2
            }),
            credentials: "include",
        })

        if (response.ok) {
            return true;
        }

    } catch (error) {
        console.error(error.message)
    }
};

const login = async ({email, password, setErrorMessage}) => {
    try {
        const response = await fetch(API_URL + "/api/stuff/signin/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": CSRF_TOKEN,
            },
            body: JSON.stringify({username: email, password}),
            credentials: "include",
        })

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("user", JSON.stringify(result));
            const decodedToken = jwtDecode(result.access);
            return {...result, user: decodedToken};
        } else {
            setErrorMessage("Worst credentials: incorrect password or login");
        }
    } catch (error) {
        setErrorMessage("Something went wrong... ", error.message);
        setTimeout(() => setErrorMessage(''), 2000);
    }
};

const refresh = async () => {

}

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.access) {
        const decodedToken = jwtDecode(user.access);
        return {...user, user: decodedToken};
    }

    return null;
};


const isAuthenticated = () => {
    const result = localStorage.getItem("user") !== null;
    return result;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
};

export default AuthService;