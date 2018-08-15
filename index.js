"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//const config = require(`../env/${process.env.NODE_ENV || 'dev'}.js`);
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const bodyParser = require('body-parser');
require("reflect-metadata");
const typeorm_1 = require("typeorm");
//import { swaggerConfig } from './config/swaggerConfig';
var config = {
    appRoot: __dirname,
    api: { port: 10010 }
};
module.exports = app; // for testing
typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
    SwaggerExpress.create(config, function (err, swaggerExpress) {
        if (err) {
            throw err;
        }
        app.use(bodyParser.json({ limit: '52mb' }));
        // install middleware
        swaggerExpress.register(app);
        const port = config.api.port || 10010;
        app.listen(port);
        console.log('API Running on port:', port);
    });
})).catch(error => console.log('TypeORM connection error: ', error));
//# sourceMappingURL=index.js.map