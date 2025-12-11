require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
const cryptoRoutes = require('./modules/cryptocurrencies/routes/cryptoRoutes');
const connectDB = require('./shared/middlewares/connect-db');
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 3000;
const hostname = process.env.Hostname;

async function startServer() {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        server.use(cors({
            origin: 'http://localhost:5173',
        }));

        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));

        server.get('/', (req, res) => {
            res.json({
                message: 'Crypto Eagle',
                database: 'MongoDB',
                status: 'Running'
            });
        });

        server.use('/api/auth', authRoutes);

        server.use('/api/cryptos', cryptoRoutes); // Make public temporarily

        server.use((error, req, res, next) => {
            console.log('Server error:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        });

        server.use((req, res) => {
            res.status(404).json({
                message: 'Route not found',
                method: req.method,
                path: req.path
            });
        });

        server.listen(PORT, hostname, (error) => {
            if (error) console.log(error.message);
            else console.log(`Server running on http://${hostname}:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();