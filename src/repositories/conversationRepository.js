const mongoClient = require('../lib/db').getMongoDb();
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');
const MONGO_COLLECTION = require('../constants/collections');
const colors = require('colors');
const moment = require('moment');

const logs = async (req, statusCode, message, errors, data) => {
    try {
        let insertData = {
            base_url: req.baseUrl,
            method: req.method,
            message, // if success
            statusCode,
            errors,
            date: moment(new Date()).format('YYYY-MM-DD'), // readable date
            created_at: new Date(),
        };

        await mongoClient
            .collection(MONGO_COLLECTION.ERROR_LOGS)
            .insertOne(insertData);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    logs,
};
