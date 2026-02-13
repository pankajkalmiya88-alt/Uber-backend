const mongoose = require('mongoose');

async function connectToDb() {
    try {
        // console.log('Connecting to DB...');
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to DB');
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1); // Optional: stop app if DB fails
    }
}

module.exports = connectToDb;
