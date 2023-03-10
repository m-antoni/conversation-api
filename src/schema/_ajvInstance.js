const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajvInstance = new Ajv({ allErrors: true });
addFormats(ajvInstance);

module.exports = ajvInstance;

// https://json-schema.org/understanding-json-schema/reference/string.html#dates-and-times
// https://github.com/ajv-validator/ajv/issues/242
// https://github.com/ajv-validator/ajv/issues/65
// https://ajv.js.org/options.html
// https://ajv.js.org/guide/formats.html
