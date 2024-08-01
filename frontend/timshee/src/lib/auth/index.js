import {api, privateApi} from "../api";

export const signUp = async (formData) => {
    try {
        await api.post('api/stuff/signup/',
            {...formData}
        );
        return true;
    } catch (error) {
        return error;
    }
};


export const refresh = async () => {
    try {
        const response = await privateApi.post('/api/stuff/token/refresh/');
        return response.data;
    } catch (error) {
        return error;
    }
}

export const verify = async () => {
    try {
        await api.post('/api/stuff/token/verify/');
        return true
    } catch (error) {
        return error;
    }
}

export const signIn = async (formData) => {
    try {
        const response = await api.post('/api/stuff/signin/',
            { username: formData.email, password: formData.password },
            { withCredentials: true }
        );
        return await response.data;
    } catch (error) {
        return error;
    }
};