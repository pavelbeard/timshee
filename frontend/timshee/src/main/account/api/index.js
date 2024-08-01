import { API_URL } from '../../../config';

export const getEmail = async ({token}) => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
    };

    const response = await fetch(`${API_URL}/api/stuff/profile/get_email/`, {
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