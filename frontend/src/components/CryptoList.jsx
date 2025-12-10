import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cryptoAPI } from '../services/api';

function CryptoList() {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCryptos = async () => {
        try {
            const response = await cryptoAPI.getCryptos();

            let cryptosArray = [];

            if (response.data && response.data.data) {
                if (Array.isArray(response.data.data)) {

                    cryptosArray = response.data.data;
                } else if (Array.isArray(response.data.data.data)) {
                    cryptosArray = response.data.data.data;
                }
            }

            setCryptos(cryptosArray);
            console.log(`Loaded ${cryptosArray.length} cryptos`);

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCryptos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this cryptocurrency?')) {
            try {
                await cryptoAPI.deleteCrypto(id);
                loadCryptos();
            } catch (error) {
                alert('Failed to delete cryptocurrency');
            }
        }
    };

    if (loading) return <div>Loading cryptocurrencies...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Cryptocurrencies</h1>

            <Link to="/cryptos/add">
                <button style={{ marginBottom: '20px', padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Add New Crypto
                </button>
            </Link>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f2f2f2' }}>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Symbol</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Price</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Market Cap</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cryptos.map((crypto) => (
                            <tr key={crypto._id}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{crypto.name}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{crypto.symbol}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>${crypto.current_price.toLocaleString()}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>${(crypto.market_cap / 1e9).toFixed(2)}B</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <Link to={`/cryptos/edit/${crypto._id}`} style={{ marginRight: '10px', color: '#2196F3' }}>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(crypto._id)}
                                        style={{ color: '#f44336', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CryptoList;