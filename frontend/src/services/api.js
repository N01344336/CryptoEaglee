import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const cryptoAPI = {
    getAllCryptos: (params = {}) => api.get('/cryptos', { params }),
    getCryptoById: (id) => api.get(`/cryptos/${id}`),
    createCrypto: (data) => api.post('/cryptos', data),
    updateCrypto: (id, data) => api.put(`/cryptos/${id}`, data),
    deleteCrypto: (id) => api.delete(`/cryptos/${id}`),
    getStats: () => api.get('/cryptos/stats/summary'),
};