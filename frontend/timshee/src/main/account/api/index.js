import AuthService from "../../api/authService";

const API_URL = process.env.REACT_APP_API_URL;
// const token = AuthService.getCurrentUser();

export const getEmail = async ({token}) => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token?.access}`,
        "Accept": "application/json",
    };

    const response = await fetch(`${API_URL}api/stuff/email/get_email/`, {
        method: "GET",
        headers,
        credentials: "include",
    });

    if (response.ok) {
        const data = await response.json();
        return data["email"];
    } else if (response.status === 401) {

    }
};