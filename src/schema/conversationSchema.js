const ajvInstance = require('./_ajvInstance');

const conversationSchema = {
    type: 'object',
    properties: {
        conversation_id: { type: 'string', maxLength: 20 }, // this is the code field
        message: { type: 'string', maxLength: 300 },
    },
    required: ['conversation_id', 'message'], // required fields
};

module.exports = ajvInstance.compile(conversationSchema);
