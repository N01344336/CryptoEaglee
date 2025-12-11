import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cryptoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Home() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setIsGuest(searchParams.get('guest') === 'true');

        loadStats();
    }, [location]);

    const loadStats = async () => {
        try {
            const response = await cryptoAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h1>CryptoEagle Tracker</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                {isGuest ? 'Guest Mode - Limited Access' : 'Simple cryptocurrency portfolio tracker'}
            </p>

            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    margin: '30px 0',
                    padding: '20px',
                    background: '#f5f5f5',
                    borderRadius: '8px'
                }}>
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                {isAuthenticated || isGuest ? (
                    <Link to="/cryptos">
                        <button style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                            View Cryptocurrencies
                        </button>
                    </Link>
                ) : (
                    <Link to="/login">
                        <button style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                            Login to View Cryptos
                        </button>
                    </Link>
                )}

                {isAuthenticated && (
                    <Link to="/cryptos/add">
                        <button style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none'
                        }}>
                            Add New Crypto
                        </button>
                    </Link>
                )}

                {!isAuthenticated && !isGuest && (
                    <Link to="/register">
                        <button style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none'
                        }}>
                            Register
                        </button>
                    </Link>
                )}
            </div>

            {isGuest && (
                <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '5px' }}>
                    <p style={{ margin: 0, color: '#856404' }}>
                        You are in guest mode. Some features are limited.
                        <Link to="/login" style={{ marginLeft: '10px', color: '#2196F3' }}>
                            Login for full access
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Home;