//const config = require(`../env/${process.env.NODE_ENV || 'dev'}.js`);
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const bodyParser = require('body-parser');
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as cors from 'cors';
//import { swaggerConfig } from './config/swaggerConfig';

var config = {
    appRoot: __dirname, // required config
    api: {port:10010} 
};

module.exports = app; // for testing
createConnection().then(async connection => {

  SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    app.use(bodyParser.json({limit: '52mb'}));
    // install middleware
    swaggerExpress.register(app);

    const port = config.api.port || 10010;
    app.listen(port);

    console.log('API Running on port:', port);

  });
}).catch(error => console.log('TypeORM connection error: ', error));