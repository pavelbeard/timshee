import { API_URL, CSRF_TOKEN } from '../../config';
import Cookies from "js-cookie";


const register = async ({firstName, lastName, email, password, password2, setErrorMessage}) => {
    try {
        const response = await fetch(API_URL + "api/stuff/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                username: email,
                password: password,
                password2: password2,
            }),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Failed to create account.');
        }

        return true;
    } catch (error) {
        return error;
    }
};

export async function refresh() {
    try {
        const response = await fetch(API_URL + "api/stuff/token/refresh/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "X-CSRFToken": CSRF_TOKEN,
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token.');
        }

        const data = await response.json();
        localStorage.setItem('access', JSON.stringify(data.access));
        return true;
    } catch (error) {
        return error;
    }
}

export async function verify({token}) {
    try {
        const response = await fetch(API_URL + "api/stuff/token/verify/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-CSRFToken": CSRF_TOKEN,
                "Authorization": `Bearer ${token.access}`,
            },
            body: JSON.stringify({ token: token }),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Token is invalid or expired.');
        }

        return true;
    } catch (error) {
        return error;
    }
}

const login = async ({ username, password }) => {
    try {
        const response = await fetch(API_URL + "api/stuff/signin/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Invalid login credentials.');
        }

        return true;
    } catch (error) {
        return error;
    }
};

const logout = async ({token}) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token.access}`,
            "X-CSRFToken": CSRF_TOKEN,
        };
        const response = await fetch(API_URL + "api/stuff/signout/", {
            method: "POST",
            headers,
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error('Failed to logout.');
        }

        return true;
    } catch (error) {
        return error;
    }

};

const getAccessToken = () => {
    const access = Cookies.get("access_token");
    if (access) {
        return {access: access};
    }

    return null;
};

const AuthService = {
    register,
    refresh,
    verify,
    login,
    logout,
    getAccessToken,
};

export default AuthService;