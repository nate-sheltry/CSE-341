// express web server
const express = require('express');
const routes = require('./routes')
const app = express();
const port = 3000;
console.log('app made')

app.use('/', routes);

console.log('app loaded')

app.listen(process.env.port || port);
console.log('Web Server is listening at port '+ (process.env.port || port));