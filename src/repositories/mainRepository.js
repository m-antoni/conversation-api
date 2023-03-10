const ObjectId = require('mongodb').ObjectId;
const mongoClient = require('../lib/db').getMongoDb();
const colors = require('colors');
const { escapeRegExp } = require('../lib/common');

// *******************************************
// * Default Global fields
// * Description: Add this fields when insert as global fields together with dates
// * { archived, subscriber_id, user_id, user_created, user_updated, created_at, updated_at }
// ******************************************
const globalFieldsToAdd = async () => {
    let data = {};
    try {
        data['archived'] = 0;
        // data['subscriber_id'] = ObjectId(user.subscriber_id);
        // data['user_id'] = ObjectId(user._id);
        // data['user_created'] = ObjectId(user._id);
        // data['user_updated'] = null;
        data['created_at'] = new Date();
        data['updated_at'] = new Date();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// *******************************************
// * INSERT ONE
// * Description: MongoDB InsertOne
// *******************************************
const insertOne = async (colName, query = {}, opt = null) => {
    try {
        let insert = query;
        // ** THIS ADDS THE DEFAULT FIELDS LIKE CREATED_AT, UPDATED_AT etc...
        const globalFields = await globalFieldsToAdd();
        insert = { ...query, ...globalFields }; // combine objects

        const mongo = await mongoClient.collection(colName).insertOne(insert);

        console.log('INSERT_ONE', colors.yellow(mongo)); // temporary logger

        return mongo;
    } catch (error) {
        console.log(error);
    }
};

// *******************************************
// * UPDATE ONE
// * Description: MongoDB updateOne
// *******************************************
const updateOne = async (colName, query = {}, setQuery = {}, opt = null) => {
    try {
        let data = { return: false, data: null };

        const updateOne = await mongoClient
            .collection(colName)
            .updateOne(query, setQuery);

        // ** if want to return the data in other cases of your query,
        if (opt !== null && opt.return === true) {
            const findData = await findOne(colName, query, opt.project);
            data.return = true;
            data.data = findData;
            data.data['acknowledged'] = true;
            return data;
        }

        console.log('UPDATE_ONE', colors.yellow(updateOne)); // temporary logger

        data.data = updateOne;
        return data;
    } catch (error) {
        console.log(error);
    }
};

// *******************************************
// * FIND ONE
// * Description: MongoDB findOne
// ******************************************
const findOne = async (colName, query = {}, project = {}, opt = null) => {
    try {
        return await mongoClient.collection(colName).findOne(query, project);
    } catch (error) {
        console.log(error);
    }
};

// *******************************************
// * FIND
// * Description: MongoDB find
// ******************************************
const find = async (colName, query = {}, project = {}, opt = null) => {
    try {
        return await mongoClient
            .collection(colName)
            .find(query, project)
            .toArray();
    } catch (error) {
        console.log(error);
    }
};

const mongoAggregate = async (colName, pipeline, opt = null) => {
    try {
        // console.log('pipeline', pipeline[0]);
        const result = await mongoClient
            .collection(colName)
            .aggregate(pipeline)
            .toArray();
        // console.log(result);
        return result[0];
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    find,
    insertOne,
    updateOne,
    findOne,
    mongoAggregate,
    globalFieldsToAdd,
};
