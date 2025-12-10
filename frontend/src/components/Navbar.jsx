import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#f0f0f0',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>
                    Home
                </Link>
                {isAuthenticated && (
                    <Link to="/cryptos" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>
                        Cryptos
                    </Link>
                )}
                {isAuthenticated && user?.role === 'admin' && (
                    <Link to="/cryptos/add" style={{ textDecoration: 'none', color: '#333' }}>
                        Add Crypto
                    </Link>
                )}
            </div>

            <div>
                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span>
                            Welcome, {user?.name} ({user?.role})
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '5px 10px',
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" style={{ marginRight: '10px', textDecoration: 'none', color: '#333' }}>
                            Login
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;