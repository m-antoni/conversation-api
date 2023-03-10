const { HttpException, HttpStatusCode } = require('../lib/httpException');
const conversationRepository = require('../repositories/conversationRepository');

function validateDto(ajvValidate) {
    return (req, res, next) => {
        const valid = ajvValidate(req.body);

        if (!valid) {
            // it is imperative that the reference to the errors is copied
            // the next time ajv runs the errors object could be overridden
            // because under the hood it is just a pointer
            // that's why the reference needs to be copied in the same execution
            // block. Note that Node is single-threaded and you do not have
            // concurrency
            // in this simple example it would work without copying
            // simply because we are directly terminating the request with
            // res.status(400).json(...)
            // but in general copying the errors reference is crucial
            let errors = [];
            const ajvErrors = ajvValidate.errors;
            //   console.log(ajvErrors); // debugging

            // manipulate error message
            ajvErrors.map((err) => {
                let modifiedMsg = `${modifiedErrorMessage(err)}`;
                errors.push(modifiedMsg);
            });
            conversationRepository.logs(
                req,
                HttpStatusCode.NOT_FOUND,
                '',
                errors
            );
            return HttpException(res, HttpStatusCode.NOT_FOUND, '', { errors });
        }
        // console.log(req.body);
        next(); // proceed with no errors
    };
}

// Modified Error message for better UX
function modifiedErrorMessage(errData) {
    let { instancePath, message } = errData;

    //  errData data response sample
    //   {
    //     instancePath: '/email',
    //     schemaPath: '#/properties/email/format',
    //     keyword: 'format',
    //     params: { format: 'email' },
    //     message: 'must match format "email"'
    //  }

    if (instancePath === '') {
        return `${message}`;
    } else {
        let sliceStr = instancePath.slice(1);
        return `"${
            sliceStr.charAt(0).toUpperCase() + sliceStr.slice(1)
        }" ${message}`;
    }
}

module.exports = validateDto;
