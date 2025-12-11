const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            dbName: process.env.DB_NAME
        });
        console.log('✅ MongoDB connected successfully');
        return mongoose.connection;
    } catch (err) {
        console.error(' MongoDB connection error:', err.message);
        throw err;
    }
}

module.exports = connectDB;