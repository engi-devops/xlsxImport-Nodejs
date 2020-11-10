import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import environment from '../environment';
import mongoose from './config/mongoose';
import routes from './app/routes';

// getting application environment
const env = process.env.NODE_ENV;
// getting application config based on environment
const envConfig = environment[env];
// setting port value
const port = envConfig.port || 1414;

const app = express();

if (!global.status_codes)
    global.status_codes = require('./app/class/helpers/StatusCodes');

if (!global.custom_message)
    global.custom_message = require('./config/message');

if (!global.Response)
    global.Response = require('./app/class/helpers/Response');


mongoose.connect(envConfig, env);
app.use(morgan(envConfig.logs));


app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use('/', routes);

app.listen(port, () =>
  console.log(`Aipxperts-interview;
 Application listening on port ${port} !`),
)

module.exports = app;