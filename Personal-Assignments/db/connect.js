const { MongoClient } = require('mongodb');
require('dotenv').config();

//connection URL
const url = process.env.MONGODB_URL;

//Database Name
const dbname = 'Lesson-2';

async function startConnection() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log(`Connected to MongoDB`)
        const db = client.db(dbname);
        return db;
    } catch (error) {
        console.error(`Error connecting to MongoDB:${dbname}`, error);
        throw error;
    }
}

module.exports = startConnection;