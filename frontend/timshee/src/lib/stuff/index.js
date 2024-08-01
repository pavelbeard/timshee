import {api} from "../api";

export async function changeEmail({data}) {
    try {
        const response = await api.post('/api/stuff/profile/change_email/',
            JSON.stringify(data)
        );
        return await response.data;
    } catch (error) {
        return error;
    }
}

export async function getEmail() {
    try {
        const response = await api.get(`/api/stuff/email/get_email/`);
        return response.data;
    } catch (error) {
        return error;
    }
}

export async function checkEmail({data}) {
    try {
        const response = await api.post(`/api/stuff/profile/check_email/`,
            JSON.stringify(data),
        );
        return await response.data;
    } catch (error) {
        return error;
    }
}

export async function getSettings () {
    try {
        const response = await api.get('/api/stuff/settings/');
        return await response.data;
    } catch (error) {
        return error;
    }
}

export function toCamelCase(str) {
    if (!str?.includes('_')) {
        return str;
    }
    return str?.replace(/_([a-z])/g, function(match, letter) {
        return letter.toUpperCase();
    });
}

export const uniqueData = (data, key) => {
    const uniqs = new Set();
    return data.filter(item => {
        if (!uniqs.has(item[key])) {
            uniqs.add(item[key]);
            return true;
        }
        return false;
    });
};
