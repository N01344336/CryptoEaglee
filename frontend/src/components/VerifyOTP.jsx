import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { verifyOTP } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const { userId, email } = location.state || {};

    useEffect(() => {
        if (!userId || !email) {
            navigate('/login');
        }
    }, [userId, email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await verifyOTP(userId, otp);
            navigate('/');
        } catch (err) {
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (!userId || !email) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Verify OTP</h2>
            <p>Enter the 6-digit code sent to: <strong>{email}</strong></p>

            {error && (
                <div style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default VerifyOTP;