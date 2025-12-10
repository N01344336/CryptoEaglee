import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cryptoAPI } from '../services/api';

function CryptoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        current_price: '',
        market_cap: '',
        volume_24h: '',
        category: 'coin'
    });

    useEffect(() => {
        if (id) {
            loadCrypto();
        }
    }, [id]);

    const loadCrypto = async () => {
        try {
            const response = await cryptoAPI.getCryptoById(id);
            setFormData(response.data.data);
        } catch (error) {
            console.error('Error loading crypto:', error);
            alert('Failed to load cryptocurrency data');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await cryptoAPI.updateCrypto(id, formData);
                alert('Cryptocurrency updated successfully!');
            } else {
                await cryptoAPI.createCrypto(formData);
                alert('Cryptocurrency created successfully!');
            }
            navigate('/cryptos');
        } catch (error) {
            console.error('Error saving crypto:', error);
            alert(error.response?.data?.message || 'Error saving cryptocurrency');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>{id ? 'Edit' : 'Add'} Cryptocurrency</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Symbol:</label>
                    <input
                        type="text"
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        disabled={id}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Price ($):</label>
                    <input
                        type="number"
                        step="0.01"
                        name="current_price"
                        value={formData.current_price}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Market Cap:</label>
                    <input
                        type="number"
                        name="market_cap"
                        value={formData.market_cap}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>24h Volume:</label>
                    <input
                        type="number"
                        name="volume_24h"
                        value={formData.volume_24h}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                        <option value="coin">Coin</option>
                        <option value="token">Token</option>
                        <option value="stablecoin">Stablecoin</option>
                        <option value="meme">Meme Coin</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            background: loading ? '#ccc' : '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Saving...' : id ? 'Update' : 'Create'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/cryptos')}
                        style={{
                            padding: '10px 20px',
                            background: '#f0f0f0',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CryptoForm;