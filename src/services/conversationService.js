const MONGO_COLLECTION = require('../constants/collections');
const { dataResponse } = require('../lib/common');
const ObjectId = require('mongodb').ObjectId;
const mainRepository = require('../repositories/mainRepository');
const conversationRepository = require('../repositories/conversationRepository');
const { HttpStatusCode } = require('../lib/httpException');

const get = async (req) => {
    const { conversation_id } = req.query;

    try {
        // ** if query params is present
        if (conversation_id) {
            // ** Check if conversation_id exists
            const findOneConversation = await mainRepository.findOne(
                MONGO_COLLECTION.CONVERSATIONS,
                { conversation_id: conversation_id, archived: 0 },
                {
                    projection: {
                        _id: 0,
                        match_key: 0,
                        message_id: 0,
                        created_at: 0,
                        updated_at: 0,
                        archived: 0,
                    },
                }
            );

            if (!findOneConversation) {
                let errMsg = `Conversation ID does not exists in the system.`;
                let statusCode = HttpStatusCode.BAD_REQUEST;
                conversationRepository.logs(req, statusCode, '', [errMsg]);
                return dataResponse(statusCode, '', [errMsg]);
            } else {
                return dataResponse(HttpStatusCode.OK, 'success', [], {
                    docs: findOneConversation,
                });
            }
        }

        // ** Get all the conversation sorted by decending
        const findAllConversations = await mainRepository.find(
            MONGO_COLLECTION.CONVERSATIONS,
            {},
            {
                projection: {
                    _id: 0,
                    match_key: 0,
                    message_id: 0,
                    created_at: 0,
                    updated_at: 0,
                    archived: 0,
                },
            }
        );

        return dataResponse(HttpStatusCode.OK, 'success', [], {
            docs: findAllConversations,
            total: findAllConversations.length,
        });
    } catch (error) {
        console.log(error);
    }
};

const create = async (req) => {
    const { conversation_id, message } = req.body;
    try {
        // ** Check if empty
        if (conversation_id === '' || message === '') {
            let errMsg = `Sorry I don't understand, all fields are required`;
            let statusCode = HttpStatusCode.BAD_REQUEST;
            conversationRepository.logs(req, statusCode, '', [errMsg]);
            return dataResponse(statusCode, '', [errMsg]);
        }

        // ** Check if conversation_id exists
        const conversationIdExists = await mainRepository.findOne(
            MONGO_COLLECTION.CONVERSATIONS,
            { conversation_id }
        );

        if (conversationIdExists) {
            let errMsg = `Conversation ID already exists in the system, please use another one`;
            let statusCode = HttpStatusCode.BAD_REQUEST;
            conversationRepository.logs(req, statusCode, '', [errMsg]);
            return dataResponse(statusCode, '', [errMsg]);
        }

        // ** This query matches the first word with case insensitive Ex: Hello or hello
        // ** Message format should be at least one comma ex: "<first word>, <other words> ...."
        const firstWord = message.split(', ')[0];
        const checkMessage = await mainRepository.findOne(
            MONGO_COLLECTION.MESSAGES,
            {
                words: { $elemMatch: { $regex: firstWord, $options: 'i' } },
            },
            { projection: { response: 1 } }
        );

        if (!checkMessage) {
            let errMsg = `Sorry I don't understand`;
            let statusCode = HttpStatusCode.BAD_REQUEST;
            conversationRepository.logs(req, statusCode, '', [errMsg]);
            return dataResponse(statusCode, '', [errMsg]);
        }

        console.log(checkMessage);

        let insertArgs = {
            conversation_id,
            match_key: firstWord,
            message,
            response: checkMessage.response,
            message_id: checkMessage._id,
        };

        // ** Insert args
        const insertConversation = await mainRepository.insertOne(
            MONGO_COLLECTION.CONVERSATIONS,
            insertArgs
        );

        if (insertConversation.acknowledged) {
            return dataResponse(HttpStatusCode.CREATED, 'success', [], {
                response_id: conversation_id,
                response: checkMessage.response,
            });
        } else {
            let errMsg = `Sorry failed to save, Please try again`;
            let statusCode = HttpStatusCode.BAD_REQUEST;
            conversationRepository.logs(req, statusCode, '', [errMsg]);
            return dataResponse(statusCode, '', [errMsg]);
        }
    } catch (error) {
        console.log(error);
    }
};

const archived = async (req) => {
    console.log(req.params);
    const { id } = req.params;

    try {
        // ** Check if conversation_id exists
        const exists = await mainRepository.findOne(
            MONGO_COLLECTION.CONVERSATIONS,
            { conversation_id: id }
        );

        if (!exists) {
            let errMsg = `Conversation id did not match in the system`;
            let statusCode = HttpStatusCode.BAD_REQUEST;
            conversationRepository.logs(req, statusCode, '', [errMsg]);
            return dataResponse(statusCode, '', [errMsg]);
        }

        // ** Soft delete or archived
        const archivedConversation = await mainRepository.updateOne(
            MONGO_COLLECTION.CONVERSATIONS,
            { conversation_id: id },
            { $set: { archived: 1 } }
        );

        if (archivedConversation.data) {
            return dataResponse(
                HttpStatusCode.OK,
                'Successfully remove a conversation',
                []
            );
        } else {
            let errMsg = `Sorry failed to save, Please try again`;
            let statusCode = HttpStatusCode.BAD_REQUEST;
            conversationRepository.logs(req, statusCode, '', [errMsg]);
            return dataResponse(statusCode, '', [errMsg]);
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    get,
    create,
    archived,
};
