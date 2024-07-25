import {API_URL, CSRF_TOKEN} from "../../config";

export async function changeEmail({token, data}) {
    try {
        const url = `${API_URL}api/stuff/email/change_email/`;
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
            "Accept": "application/json",
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }

        const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getEmail({token}) {
    try {
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

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        return data["email"];
    } catch (error) {
        return error;
    }
}

export async function checkEmail({data}) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
        };
        const response = await fetch(`${API_URL}api/stuff/email/check_email/`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getDynamicSettings ({ token }) {
    try {
        const url = `${API_URL}api/stuff/dynamic-settings/`;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}

export function toCamelCase(str) {
    if (!str.includes('_')) {
        return str;
    }

    return str.replace(/_([a-z])/g, function(match, letter) {
        return letter.toUpperCase();
    });
}

const uniqs = new Set();
export const uniqueData = (data, key) => {
    return data.filter(item => {
        if (!uniqs.has(item[key])) {
            uniqs.add(item[key]);
            return true;
        }
        return false;
    })
};
