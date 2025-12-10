import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import CryptoList from './components/CryptoList';
import CryptoForm from './components/CryptoForm';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Navbar />

                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />
                        <Route path="/" element={<Home />} />

                        <Route path="/cryptos" element={
                            <ProtectedRoute>
                                <CryptoList />
                            </ProtectedRoute>
                        } />

                        <Route path="/cryptos/add" element={
                            <ProtectedRoute requiredRole="admin">
                                <CryptoForm />
                            </ProtectedRoute>
                        } />

                        <Route path="/cryptos/edit/:id" element={
                            <ProtectedRoute requiredRole="admin">
                                <CryptoForm />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;