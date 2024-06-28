import axios from 'axios';
import { getAccessToken } from './authService';

const baseURL = "https://2269352c-3770-4e68-94a8-8d78b769b1f2-00-23f639ncudixh.pike.replit.dev/"; // Access environment variable

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(async config => {
    const token = await getAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getProducts = async () => {
    const response = await apiClient.get('/products');
    return response.data;
};

export const addToCart = async (product) => {
    const response = await apiClient.post('/cart', product);
    return response.data;
};

export const checkout = async (order) => {
    const response = await apiClient.post('/order', order);
    return response.data;
};

export default apiClient;