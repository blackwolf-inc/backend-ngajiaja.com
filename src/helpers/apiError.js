const { STATUS_CODES } = require('http');
const { constants } = require('http2');

class ApiError {
  constructor(code, message, errors = {}) {
    this.code = code;
    this.message = message;
    if (errors) {
      this.errors = errors;
    }
  }

  static badRequest(message) {
    return new ApiError(constants.HTTP_STATUS_BAD_REQUEST, message);
  }

  static unauthorized(message = STATUS_CODES[constants.HTTP_STATUS_UNAUTHORIZED]) {
    return new ApiError(constants.HTTP_STATUS_UNAUTHORIZED, message);
  }

  static forbidden(message = STATUS_CODES[constants.HTTP_STATUS_FORBIDDEN]) {
    return new ApiError(constants.HTTP_STATUS_FORBIDDEN, message);
  }

  static notFound(message = STATUS_CODES[constants.HTTP_STATUS_NOT_FOUND]) {
    return new ApiError(constants.HTTP_STATUS_NOT_FOUND, message);
  }

  static unprocessableEntity(
    message = STATUS_CODES[constants.HTTP_STATUS_UNPROCESSABLE_ENTITY],
    errors = {}
  ) {
    return new ApiError(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY, message, errors);
  }
}

module.exports = ApiError;
