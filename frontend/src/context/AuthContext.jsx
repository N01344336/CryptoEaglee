import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Set auth token in axios headers
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const verifyOTP = async (userId, otp) => {
        try {
            const response = await api.post('/auth/verify-otp', { userId, otp });
            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const register = async (email, password, name) => {
        try {
            const response = await api.post('/auth/register', { email, password, name });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const value = {
        user,
        token,
        loading,
        login,
        verifyOTP,
        register,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};