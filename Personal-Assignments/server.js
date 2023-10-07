// express web server
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

console.log('app made');

app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(cors())
  .use('/', routes);

console.log('app loaded');

app.listen(process.env.port || port);
console.log('Web Server is listening at port '+ (process.env.port || port));