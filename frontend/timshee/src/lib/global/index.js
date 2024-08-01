import {api} from "../api";

export async function getPhoneCodes () {
    try {
        const response = await api.get('/api/order/phone-codes/');
        return await response.data;
    } catch (error) {
        return error;
    }
}

export async function getCountries() {
    try {
        const response = await api.get('/api/order/countries/');
        return await response.data;
    } catch (error) {
        return error;
    }
}

export async function getProvinces() {
    try {
        const response = await api.get('/api/order/provinces/');
        return await response.data;
    } catch (error) {
        return error;
    }
}

export async function getOrders () {
    try {
        const response = await api.get('/api/order/orders/get_orders_by_user/');
        return await response.data;
    } catch (error) {
        return error;
    }
}

export async function updateOrder ({ orderId, data }) {
    try {
        const response = await api.put(`/api/order/orders/${orderId}/`,
            JSON.stringify(data)
        );
        return await response.data;
    } catch (error) {
        return error;
    }
}