const swaggerAutogen = require('swagger-autogen')();

const swaggerOptions = {
  info: {
    title: 'Project 2 API',
    description: 'An API For my webservices class.',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: process.env.GITHUB_CLIENT_CALLBACK,
      scopes: {
        ['read:user write:user']: 'scopes'
      }
    },
  },
  security : [
    {
      OAuth2:['read:user write:user']
    },
  ],
};

const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/index.js'
];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, swaggerOptions);

//swaggerAutotgen(outputFile, endpointsFiles, doc).then(async () => {
//  await import('./index.js');
//})