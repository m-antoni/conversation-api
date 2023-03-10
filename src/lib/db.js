const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
// const logger = require('../lib/logger').getLogger();

const { MONGO_URI, DB_DATABASE } = process.env;
let mongoDb = { collection: () => {} };

const mongoDriverConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // bufferMaxEntries: 0,
    // useCreateIndex: true,
    // useFindAndModify: false,
};

let reconnectAttempt = false;

const connectToMongo = async (retryCount = 0) => {
    try {
        const database = await MongoClient.connect(
            `${MONGO_URI}`,
            mongoDriverConfig
        );

        mongoDb = database.db(DB_DATABASE);

        database.on('close', (event) => {
            // Here to provide alerting, but not too much

            if (!reconnectAttempt) {
                // logger.fatal('Connection to MongoDB lost. Attempting to reconnect.');
                console.log(
                    'Connection to MongoDB lost. Attempting to reconnect.'
                );
                setTimeout(() => {
                    reconnectAttempt = false;
                }, 300000);

                reconnectAttempt = true;
            }
        });
        // console.log('DATABASE: ' + `${DB_DATABASE}`.blue);
        return true;
    } catch (ex) {
        if (retryCount < 3) {
            // logger.warn(`Failed to connect to Database: Retrying ${retryCount}`);
            console.log(
                `Failed to connect to Database: Retrying ${retryCount}`
            );
            return connectToMongo(retryCount + 1);
        } else {
            console.log(ex);
            return false;
        }
    }
};

module.exports = {
    connectToMongo,

    getMongoDb: () => {
        return mongoDb;
    },
};
