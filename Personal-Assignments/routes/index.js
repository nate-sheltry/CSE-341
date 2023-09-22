const routes = require('express').Router();
console.log('got router')
const lesson1Controller = require('../controllers/lesson1')

routes.get('/', lesson1Controller.defaultRoute);
routes.get('/hannah', lesson1Controller.hannahRoute);
routes.get('/sierra', lesson1Controller.sierraRoute);

module.exports = routes;