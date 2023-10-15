const routes = require('express').Router();
const bodyParser = require('body-parser');

console.log('got router');

const lesson1Controller = require('../controllers/lesson1');
const lesson2Controller = require('../controllers/lesson2');
const lesson3Controller = require('../controllers/lesson3');

const startMongoDB = require('../db/connect');

const databases = {
    Lesson2: {string: 'lesson-2'},
    cse341: {string: 'cse-341'}
};

function outputServerError(error, res){
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
}

function determineDatabase(database, collection = 'contacts'){
    let db;
    switch(database){
        case databases.Lesson2.string:
            db = startMongoDB.startConnectionL2;
            break;
        case databases.cse341.string:
            db = startMongoDB.startConnectionL3;
            break;
    }
    return [db, collection];


}

/*Enable Swagger API*/
routes.use('/', require('./swagger'))

/*GET Routes*/
routes.get('/', lesson1Controller.defaultRoute);
routes.get('/hannah', lesson1Controller.hannahRoute);
routes.get('/sierra', lesson1Controller.sierraRoute);

routes.get('/api/:database/:collection-data', async (req, res) => {
    const databaseName = req.params.database;
    const collectionName = req.params.collection;

    let database; let collection;
    [database, collection] = determineDatabase(databaseName, collectionName);

    try {
        const db = await database();
        const documents = await lesson2Controller.getAllDocuments(db, collection);
        res.json(documents);
    } catch (error) {
        outputServerError(error, res);
    }
});

routes.get('/api/:database/:collection', async (req, res) => {
    const databaseName = req.params.database;
    const collectionName = req.params.collection;

    let database; let collection;
    [database, collection] = determineDatabase(databaseName, collectionName);

    try {
        const query = req.query;
        const fname = query.fname || 'NONE';
        const lname = query.lname || 'NONE';

        console.log(fname);

        const db = await database();
        const documents = await lesson2Controller.getRequestByName(db, collection, fname, lname);
        res.json(documents);
    } catch (error) {
        outputServerError(error, res);
    }
});

/*POST Routes*/
routes.use(bodyParser.json());

routes.post('/api/:database/:collection/post', async (req, res) => {
    const databaseName = req.params.database;
    const collectionName = req.params.collection;

    let database; let collection;
    [database, collection] = determineDatabase(databaseName, collectionName);

    const postData = req.body;

    try {
        const db = await database();
        const addedData = await lesson3Controller.postData(db, collection, postData);
        res.status(201).json(addedData);

    } catch (error) {
        outputServerError(error, res);
    }
});

/*PUT Routes*/
routes.put('/api/:database/:collection/:id', async (req, res) => {
    const databaseName = req.params.database;
    const collectionName = req.params.collection;

    let database; let collection;
    [database, collection] = determineDatabase(databaseName, collectionName);

    const id = req.params.id;
    const updateData = req.body;

    try {
        const db = await database();
        const updatedData = await lesson3Controller.putData(db, collection, id, updateData);
        res.status(204).json(updatedData);
    } catch (error) {
        outputServerError(error, res);
    }
});

/*DELETE Routes*/
routes.delete('/api/:database/:collection/delete=:id', async (req, res) => {
    const databaseName = req.params.database;
    const collectionName = req.params.collection;

    let database; let collection;
    [database, collection] = determineDatabase(databaseName, collectionName);

    const id = req.params.id;
    try {
        const db = await database();
        const deletedData = await lesson3Controller.deleteData(db, collection, id);
        res.status(200).json(deletedData);
    } catch (error) {
        outputServerError(error, res);
    }
});

module.exports = routes;