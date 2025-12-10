import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const cryptoAPI = {
    login: (data) => api.post('/auth/login', data),
    verifyOTP: (data) => api.post('/auth/verify-otp', data),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
    getCryptos: (params = {}) => api.get('/cryptos', { params }),
    getCryptoById: (id) => api.get(`/cryptos/${id}`),
    createCrypto: (data) => api.post('/cryptos', data),
    updateCrypto: (id, data) => api.put(`/cryptos/${id}`, data),
    deleteCrypto: (id) => api.delete(`/cryptos/${id}`),
    getStats: () => api.get('/cryptos/stats/summary'),
};