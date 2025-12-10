import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function VerifyOTP() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTime, setResendTime] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const { verifyOTP } = useAuth();
    const navigate = useLocation();
    const location = useNavigate();

    const { userId, email } = location.state || {};

    useEffect(() => {
        if (!userId || !email) {
            navigate('/login');
        }
    }, [userId, email, navigate]);

    useEffect(() => {
        let timer;
        if (resendTime > 0 && !canResend) {
            timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
        } else if (resendTime === 0) {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [resendTime, canResend]);

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await verifyOTP(userId, otpCode);
            navigate('/');
        } catch (err) {
            setError(err.message || 'OTP verification failed');
            setOtp(['', '', '', '', '', '']);
            document.getElementById('otp-0').focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendTime(60);
        setCanResend(false);
        alert('OTP resent to your email');
    };

    if (!userId || !email) {
        return <div>Redirecting...</div>;
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                }}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            style={{
                                width: '40px',
                                height: '50px',
                                textAlign: 'center',
                                fontSize: '24px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    ))}
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
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>
                    {canResend ? (
                        <button
                            onClick={handleResendOTP}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#2196F3',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Resend OTP
                        </button>
                    ) : (
                        `Resend OTP in ${resendTime}s`
                    )}
                </p>
                <p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#666',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default VerifyOTP;