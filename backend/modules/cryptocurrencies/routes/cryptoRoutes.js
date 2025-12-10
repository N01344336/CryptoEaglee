const express = require('express');
const router = express.Router();
const cryptoModel = require('../models/cryptoModel');
const { validateCreateCrypto, validateUpdateCrypto, validateId } = require('../middlewares/cryptoValidation');

router.get('/', async (req, res) => {
    try {
        const { symbol, minPrice, maxPrice } = req.query;
        const filters = {};

        if (symbol) filters.symbol = symbol;
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;

        const cryptos = await cryptoModel.getCryptos(filters);

        res.status(200).json({
            message: 'Cryptocurrencies retrieved successfully',
            data: cryptos,
            count: cryptos.length,
            filters: Object.keys(filters).length > 0 ? filters : undefined
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving cryptocurrencies',
            error: err.message
        })
    }
});

router.get('/:id', validateId, async (req, res) => {
    try {
        const crypto = await cryptoModel.getCryptoById(req.params.id);

        res.status(200).json({
            message: 'Cryptocurrency retrieved successfully',
            data: crypto
        });
    } catch (err) {
        if (err.message === 'Cryptocurrency not found') {
            return res.status(404).json({
                message: err.message
            });
        }
        res.status(500).json({
            message: ' Error retrieving cryptocurrency',
            error: err.message
        });
    }
});

router.post('/', validateCreateCrypto, async (req, res) => {
    try {
        const newCrypto = await cryptoModel.addnewCrypto(req.body);

        res.status(201).json({
            message: 'Cryptocurrency created successfully',
            data: newCrypto
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error creating cryptocurrency',
            error: err.message
        });
    }
});

router.put('/:id', validateUpdateCrypto, async (req, res) => {
    try {
        const updateCrypto = await cryptoModel.updateCrypto(req.params.id, req.body);

        res.status(200).json({
            message: 'Cryptocurrency update successful',
            data: updateCrypto
        });
    } catch (err) {
        if (err.message === 'Cryptocurrency not found' || err.message === 'Invalid cryptocurrency ID') {
            return res.status(404).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: 'Error updating cryptocurrency',
            error: err.message
        });
    }
});

router.delete('/:id', validateId, async (req, res) => {
    try {
        const deletedCrypto = await cryptoModel.deleteCrypto(req.params.id);

        res.status(200).json({
            message: 'Cryptocurrency has been deleted successfully',
        });
    } catch (err) {
        if (err.message === 'Cryptocurrency not found') {
            return res.status(404).json({
                message: err.message
            });
        }
        res.status(500).json({
            message: 'Error deleting cryptocurrency',
            error: err.message
        });
    }
});

router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await cryptoModel.getCryptoStats();

        res.status(200).json({
            message: 'Statistics retrieved successfully',
            data: stats
        });
    } catch (err) {
        res.status(500).json({
            message: 'Errorretrieving statistics',
            error: err.message
        });
    }
});

module.exports = router;