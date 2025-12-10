import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h1>CryptoEagle Tracker</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                Simple cryptocurrency portfolio tracker
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                <Link to="/cryptos">
                    <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                        View Cryptocurrencies
                    </button>
                </Link>
                <Link to="/cryptos/add">
                    <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none' }}>
                        Add New Crypto
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Home;