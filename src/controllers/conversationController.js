const { HttpException, HttpStatusCode } = require('../lib/httpException');
const ConversationService = require('../services/conversationService');

const get = async (req, res) => {
    try {
        const result = await ConversationService.get(req);
        HttpException(res, result.statusCode, result.message, result);
    } catch (error) {
        console.log(error);
        HttpException(
            res,
            HttpStatusCode.SERVER_ERROR,
            'Internal Server Error'
        );
    }
};

const create = async (req, res) => {
    try {
        const result = await ConversationService.create(req);
        HttpException(res, result.statusCode, result.message, result);
    } catch (error) {
        console.log(error);
        HttpException(
            res,
            HttpStatusCode.SERVER_ERROR,
            'Internal Server Error'
        );
    }
};

const archived = async (req, res) => {
    try {
        const result = await ConversationService.archived(req);
        HttpException(res, result.statusCode, result.message, result);
    } catch (error) {
        console.log(error);
        HttpException(
            res,
            HttpStatusCode.SERVER_ERROR,
            'Internal Server Error'
        );
    }
};

module.exports = {
    get,
    create,
    archived,
};
