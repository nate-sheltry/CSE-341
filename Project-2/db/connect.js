const { MongoClient } = require('mongodb');
require('dotenv').config();

//connection URL
const url = process.env.MONGODB_URI;

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

async function startConnectionProject2(){return startConnection('project-2');}

module.exports = {
    startConnection,
    startConnectionProject2
};