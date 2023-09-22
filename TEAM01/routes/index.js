const express = require('express');
const routes = require('express').Router();
const app = express();
const myController = require('../controllers/professional')


routes.get('/professional', myController.getProfessional);
routes.get('/', myController.frontend);
routes.get('/style.css', myController.style);
routes.get('/script.js', myController.script);

module.exports = routes;