/**
 * status: 0 err, 1 success
 * message: '' will have value of success,
 * errors: [] parameter should be array of values
 */
const dataResponse = (statusCode, message = '', errors = [], data = null) => {
    return {
        statusCode,
        message,
        errors,
        ...data,
    };
};

module.exports = {
    dataResponse,
};
