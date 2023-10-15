// express web server
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes');
const app = express();
const port = 3000;
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

console.log('app made');

app
  .use(cors())
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
  .use(passport.initialize())
  .use(passport.session())
  .use('/', routes);

console.log('app loaded');

app.listen(process.env.port || port);
console.log('Web Server is listening at port '+ (process.env.port || port));