require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const server = express();
const cors = require('cors');
const cryptoRoutes = require('./modules/cryptocurrencies/routes/cryptoRoutes');
const connectDB = require('./shared/middlewares/connect-db');
const { authenticate, authorize } = require('./middlewares/auth');

const PORT = process.env.PORT || 3000;
const hostname = process.env.Hostname;

server.get('/', (req, res) => {
    res.json({
        message: 'Crypto Eagle',
        database: 'MongoDB',
        status: 'Running'
    });
});

server.use(cors({
    origin: 'http://localhost:5173',
}));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(connectDB);
server.use('/api/cryptos', authenticate, cryptoRoutes);
server.use('/api/auth', authRoutes)

server.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Oops! Internal server error!');
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