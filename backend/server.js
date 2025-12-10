require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
const cryptoRoutes = require('./modules/cryptocurrencies/routes/cryptoRoutes');
const connectDB = require('./shared/middlewares/connect-db');

const PORT = process.env.PORT || 3000;
const hostname = process.env.Hostname;

server.use(express.json());
server.use(express.urlencoded({ extend: true }));

server.use(connectDB);
server.use('/api/cryptos', cryptoRoutes);
server.use(cors());

server.get('/', (req, res) => {
    res.json({
        message: 'Crypto Eagle',
        database: 'MongoDB',
        status: 'Running'
    });
});

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