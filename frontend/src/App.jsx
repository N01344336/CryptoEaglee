import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CryptoForm from './components/CryptoForm';
import Home from './pages/Home';

function App() {
    return (
        <Router>
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <nav style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
                    <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>Home</Link>
                    <Link to="/cryptos" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>Cryptos</Link>
                    <Link to="/cryptos/add" style={{ textDecoration: 'none', color: '#333' }}>Add Crypto</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cryptos" element={<CryptoList />} />
                    <Route path="/cryptos/add" element={<CryptoForm />} />
                    <Route path="/cryptos/edit/:id" element={<CryptoForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;