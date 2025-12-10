const Crypto = require('./CryptoSchema');

const getCryptos = async (queryParams = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'market_cap',
            order = 'desc',
            search,
            minPrice,
            maxPrice,
            category
        } = queryParams;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { symbol: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        const cryptos = await Crypto.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Crypto.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return {
            data: cryptos,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    } catch (err) {
        throw new Error(`Error fetching cryptocurrencies: ${error.message}`);
    }
};

const getCryptoById = async (id) => {
    try {
        const crypto = await Crypto.findById(id);

        if (!crypto) {
            throw new Error('Cryptocurrency not found');
        }

        return crypto;
    } catch (err) {
        if (err.kind === 'ObjectId') {
            throw new Error('Invalid cryptocurrency ID');
        }
        throw new Error(`Error fetching cryptocurrency: ${err.message}`);
    }
};

const getCryptoBySymbol = async (symbol) => {
    try {
        const crypto = await Crypto.findOne({ symbol: symbol.toUpperCase() });
        return crypto;
    } catch (err) {
        throw new Error(`Error fetching cryptocurrency by symbol: ${err.message}`);
    }
};

const addnewCrypto = async (cryptoData) => {
    try {
        const existingCrypto = await getCryptoBySymbol(cryptoData.symbol);
        if (existingCrypto) {
            throw new Error('Cryptocurrency with this symbol already exists');
        }

        const newCrypto = new Crypto(cryptoData);
        await newCrypto.save();

        return newCrypto;
    } catch (err) {
        throw new Error(`Error creating cryptocurrency: ${err.message}`);
    }
};

const updateCrypto = async (id, updateData) => {
    try {
        delete updateData.symbol;

        const updatedCrypto = await Crypto.findByIdAndUpdate(
            id,
            { ...updateData, last_updated: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedCrypto) {
            throw new Error('Cryptocurrency not found');
        }

        return updatedCrypto
    } catch (err) {
        if (err.kind == 'ObjectId') {
            throw new Error('Invalid cryptocurrency ID');
        }
        throw new Error(`Error updating cryptocurrency: ${err.message}`);
    }
};

const deleteCrypto = async (id) => {
    try {
        const deletedCrypto = await Crypto.findByIdAndDelete(id);

        if (!deletedCrypto) {
            throw new Error('Cryptocurrency not found');
        }

        return deletedCrypto;
    } catch (err) {
        if (err.kind === 'ObjectId') {
            throw new Error('Invalid cryptocurrency ID');
        }
        throw new Error(`Error deleting cryptocurrency: ${err.message}`);
    }
};

const getCryptoStats = async () => {
    try {
        const stats = await Crypto.aggregate([
            {
                $group: {
                    _id: null,
                    totalCryptos: { $sum: 1 },
                    averagePrice: { $avg: '$current_price' },
                    totalMarketCap: { $sum: '$market_cap' },
                    highestPrice: { $max: '$current_price' },
                    lowestPrice: { $min: '$current_price' }
                }
            }
        ]);

        return stats[0] || {};
    } catch (err) {
        throw new Error(`Error getting statistics: ${err.message}`);
    }
};

module.exports = {
    getCryptos,
    getCryptoById,
    getCryptoBySymbol,
    getCryptoStats,
    addnewCrypto,
    updateCrypto,
    deleteCrypto
};