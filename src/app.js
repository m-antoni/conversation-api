const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongo } = require('./lib/db');
const app = express();
require('dotenv').config();
require('colors');
const PORT = process.env.PORT || 8080;
const mainRoutes = require('./routes/_mainRoutes');
const { appLogger, createTableRoutes } = require('./lib/logger');

async function main() {
    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: true })); // form-urlencoded

    //*******************************************
    // * Set CORS
    // ******************************************
    app.use(cors());

    //*******************************************
    // * Connect to Database
    // ******************************************
    try {
        await connectToMongo();
    } catch (ex) {
        console.log(ex);
    }

    //*******************************************
    // * Set Middlewares
    // ******************************************
    app.use(helmet()); // set security http headers
    app.use(xss()); // sanitize request data

    //*******************************************
    // * Main Routes
    // ******************************************
    mainRoutes(app);

    //*******************************************
    // * CONSUME ALL THE ROUTES
    // ******************************************
    createTableRoutes(app);

    //*******************************************
    // * Start Server
    // ******************************************
    app.listen(PORT);
    appLogger();
}

main();
