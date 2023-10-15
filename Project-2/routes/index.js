const routes = require('express').Router();
const bodyParser = require('body-parser');
const NONE = 'NONE';
console.log('got router');

const universalController = require('../controllers/universal-controller');
const gamesController = require('../controllers/games-controller');
const playersController = require('../controllers/players-controller');
const oauthController =  require('../controllers/oauth');

const startMongoDB = require('../db/connect');

const databases = Object.freeze({
    games: {string: 'games'},
    players: {string: 'players'}
});
const headerRes = Object.freeze({
    title: { 
        database: 'Database',
        collection: 'Collection'
        },
    responses: {
        notFound: 'not-found',
        connected: 'connected'
        }
});

function databaseCollectionCheck(error, res){
    console.error('Error handling request:', error);
    res
        .status(404)
        .set(headerRes.title.collection, headerRes.responses.notFound)
        .send('Database Not Found');
}

function outputServerError(error, res){
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
}

function determineCollection(collection = 'contacts'){
    let databaseName;
    switch(collection){
        case databases.games.string:
        case databases.players.string:
            databaseName = 'project-2';
            break;
        default:
            databaseName = null;
    }
    return [databaseName, collection];
}

/*Enable Swagger API*/
routes.use('/', require('./swagger'));
routes.use('/', require('./oauth'));

/*GET Routes*/

async function determineGetRequest(req, res, db, collection){
    const query = req.query;
    const nameQuery = query.name || NONE;
    let documents;
    switch(collection){
        case databases.games.string:
            const yearQuery = query.year || NONE;
            const betaQuery = query.beta || NONE;
            documents = await gamesController.getGames(db, collection, nameQuery, yearQuery, betaQuery);
            break;
        case databases.players.string:
            const gameQuery = query.game || NONE;
            const refundQuery = query.refund || NONE;
            const purchaseQuery = query.purchase || NONE;
            const lastPlayedQuery = query.lastPlayed || NONE;
            const idQuery = query.playerId || NONE;
            documents = await playersController.getPlayers(db, collection,
                nameQuery, gameQuery, refundQuery,purchaseQuery, lastPlayedQuery, idQuery);
            break;
    }
    res
        .status(200)
        .set(headerRes.title.database, headerRes.responses.connected)
        .set(headerRes.title.collection, headerRes.responses.connected)
        .json(documents);
}

routes.get('/api/:collection', oauthController.isAuthenticated, async (req, res) => {
    const collectionName = req.params.collection;
    let collection; let databaseName;
    [databaseName, collection] = determineCollection(collectionName);
    try {
        const db = await startMongoDB.startConnection(databaseName);
        await determineGetRequest(req, res, db, collection);
    } catch (error) {
        if(databaseName == null){
            databaseCollectionCheck(error, res);
            return;
        }
        outputServerError(error, res);
    }
});

/* Check for valid data */

function checkForValidPostData(postData, collection){
    let expectedKeys; let receivedKeys; let isValidFormat;
    if(collection == databases.players.string){
        expectedKeys = ['name', 'id', 'game', 'gameVersion', 'purchaseDate', 'refundWindow', 'lastPlayed'];
        receivedKeys = Object.keys(postData);
        isValidFormat = expectedKeys.every(key => receivedKeys.includes(key));
    }
    else if(collection == databases.games.string){
        expectedKeys = ['name', 'currentVersion', 'releaseYear', 'betaStatus'];
        receivedKeys = Object.keys(postData);
        isValidFormat = expectedKeys.every(key => receivedKeys.includes(key));
    }
    return isValidFormat;
}

/*POST Routes*/
routes.use(bodyParser.json());

async function determinePostRequest(req, res, db, collection){
    const postData = req.body;
    const isValidFormat = checkForValidPostData(postData, collection);
    if(isValidFormat){
        const addedData = await universalController.postData(db, collection, postData);
        res.status(201).json(addedData);
        return;
    }
    else{
        res.status(400).send('Invalid data format');
        return;
    }
}

routes.post('/api/:collection/post', oauthController.isAuthenticated, async (req, res) => {
    const collectionName = req.params.collection;
    let collection; let databaseName;
    [databaseName, collection] = determineCollection(collectionName);
    try {
        const db = await startMongoDB.startConnection(databaseName);
        determinePostRequest(req, res, db, collection);
    } catch (error) {
        if(databaseName == null){
            databaseCollectionCheck(error, res);
            return;
        }
        outputServerError(error, res);
    }
});

/*PUT Routes*/

function checkForValidPutData(postData, collection){
    let expectedKeys; let receivedKeys; let isValidFormat;
    if(collection == databases.players.string){
        expectedKeys = ['name', 'id', 'game', 'gameVersion', 'purchaseDate', 'refundWindow', 'lastPlayed'];
        receivedKeys = Object.keys(postData);
        isValidFormat = receivedKeys.every(key => expectedKeys.includes(key));
    }
    else if(collection == databases.games.string){
        expectedKeys = ['name', 'currentVersion', 'releaseYear', 'betaStatus'];
        receivedKeys = Object.keys(postData);
        isValidFormat = receivedKeys.every(key => expectedKeys.includes(key));
    }
    return isValidFormat;
}

async function determinePutRequest(req, res, db, collection){
    const postData = req.body;
    const isValidFormat = checkForValidPutData(postData, collection);
    const id = req.params.id;
    const updateData = req.body;

    if(isValidFormat){
        const updatedData = await universalController.putData(db, collection, id, updateData);
        res.status(204).json(updatedData);
        return;
    }
    else{
        res.status(400).send('Invalid data format');
        return;
    }
}

routes.put('/api/:collection/:id', oauthController.isAuthenticated, async (req, res) => {
    const collectionName = req.params.collection;
    let collection; let databaseName;
    [databaseName, collection] = determineCollection(collectionName);

    try {
        const db = await startMongoDB.startConnection(databaseName);
        determinePutRequest(req, res, db, collection);
    } catch (error) {
        if(databaseName == null){
            databaseCollectionCheck(error, res);
            return;
        }
        outputServerError(error, res);
    }
});

/*DELETE Routes*/

routes.delete('/api/:collection/delete=:id', oauthController.isAuthenticated, async (req, res) => {
    const collectionName = req.params.collection;
    let collection; let databaseName;
    [databaseName, collection] = determineCollection(collectionName);

    const id = req.params.id;

    try {
        const db = await startMongoDB.startConnection(databaseName);
        const deletedData = await universalController.deleteData(db, collection, id);
        res.status(200).json(deletedData);
    } catch (error) {
        if(databaseName == null){
            databaseCollectionCheck(error, res);
            return;
        }
        outputServerError(error, res);
    }
});

module.exports = routes;