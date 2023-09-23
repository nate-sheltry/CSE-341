const routes = require('express').Router();
console.log('got router')
const lesson1Controller = require('../controllers/lesson1')
const lesson2Controller = require('../controllers/lesson2')

const startMongoDB = require('../db/connect');

routes.get('/', lesson1Controller.defaultRoute);
routes.get('/hannah', lesson1Controller.hannahRoute);
routes.get('/sierra', lesson1Controller.sierraRoute);

routes.get('/contacts-data', async (req, res) => {
    try {
        const db = await startMongoDB()
        const documents = await lesson2Controller.getAllDocuments(db, 'contacts');
        res.json(documents);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500),send('Internal Server Error');
    }
});

routes.get('/contacts', async (req, res) => {
    try {
        let parameter; let question;
        const query = req.query;
        const fname = query.fname || 'NONE';
        const lname = query.lname || 'NONE';

        const db = await startMongoDB()
        const documents = await lesson2Controller.getRequestByName(db, 'contacts', fname, lname);
        res.json(documents);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500),send('Internal Server Error');
    }
});

module.exports = routes;