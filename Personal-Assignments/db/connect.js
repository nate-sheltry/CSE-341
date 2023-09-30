const { MongoClient } = require('mongodb');
require('dotenv').config();

//connection URL
const url = process.env.MONGODB_URL;

//Database Name

async function startConnection(dbname) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        return db;
    } catch (error) {
        console.error(`Error connecting to MongoDB:${dbname}`, error);
        throw error;
    }
}

async function startConnectionL2(){return startConnection('Lesson-2');}

async function startConnectionL3(){return startConnection('CSE-341');}

module.exports = {
    startConnectionL2,
    startConnectionL3
};