import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const cryptoAPI = {
    getCryptos: (params = {}) => api.get('/cryptos', { params }),
    getCryptoById: (id) => api.get(`/cryptos/${id}`),
    createCrypto: (data) => api.post('/cryptos', data),
    updateCrypto: (id, data) => api.put(`/cryptos/${id}`, data),
    deleteCrypto: (id) => api.delete(`/cryptos/${id}`),
    getStats: () => api.get('/cryptos/stats/summary'),
};