import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cryptoAPI } from '../services/api';

function Home() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

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
                Simple cryptocurrency portfolio tracker
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
                    <div style={{ padding: '15px', background: 'white', borderRadius: '6px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>Total Cryptos</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                            {stats.totalCryptos || 0}
                        </div>
                    </div>

                    <div style={{ padding: '15px', background: 'white', borderRadius: '6px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>Avg Price</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                            ${stats.averagePrice ? stats.averagePrice.toFixed(2) : '0.00'}
                        </div>
                    </div>

                    <div style={{ padding: '15px', background: 'white', borderRadius: '6px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>Market Cap</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                            ${stats.totalMarketCap ? (stats.totalMarketCap / 1e9).toFixed(1) + 'B' : '0'}
                        </div>
                    </div>

                    <div style={{ padding: '15px', background: 'white', borderRadius: '6px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>Highest Price</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                            ${stats.highestPrice ? stats.highestPrice.toLocaleString() : '0'}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                <Link to="/cryptos">
                    <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
                        View Cryptocurrencies
                    </button>
                </Link>
                <Link to="/cryptos/add">
                    <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none' }}>
                        Add New Crypto
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Home;