const HttpException = (res, statusCode, message, data = null) => {
  const responseData = {
    message,
    statusCode,
    ...data,
  };
  return res.status(statusCode).json(responseData);
};

const HttpStatusCode = {
  OK: 200, // Status: OK
  CREATED: 201, // Status: Created
  BAD_REQUEST: 400, // Status: Bad Request
  UNAUTHORIZED: 401, // Status: Unauthorized
  NOT_FOUND: 404, // Status: Not Found
  SERVER_ERROR: 500, // Status: Internal Server Error'
};

module.exports = {
  HttpException,
  HttpStatusCode,
};
