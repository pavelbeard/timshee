import {jwtDecode} from 'jwt-decode';
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = Cookies.get("csrftoken");

const register = async ({firstName, lastName, email, password, setErrorMessage}) => {
    try {
        const response = await fetch(API_URL + "api/stuff/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            }),
            credentials: "include",
        })

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("user", JSON.stringify(result));
            const decodedToken = jwtDecode(result.access);
            return {...result, user: decodedToken};
        }

    } catch (error) {
        setErrorMessage("Server's error...", error.message);
        setTimeout(() => setErrorMessage(''), 2000);
    }
};

const login = async ({email, password, setErrorMessage}) => {
    try {
        const response = await fetch(API_URL + "api/stuff/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({username: email, password}),
            credentials: "include",
        })

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("user", JSON.stringify(result));
            const decodedToken = jwtDecode(result.access);
            return {...result, user: decodedToken};
        }
    } catch (error) {
        setErrorMessage("Something went wrong... ", error.message);
        setTimeout(() => setErrorMessage(''), 2000);
    }
};

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

const getCsrfToken = () => {}

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