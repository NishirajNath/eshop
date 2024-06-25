import axios from 'axios';
import { getAccessToken } from './authService';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
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