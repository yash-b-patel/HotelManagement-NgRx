/**
 * Custom Application Error
 * ------------------------
 * Extends the native Error class with an HTTP status code and an
 * `isOperational` flag so the centralized error handler can distinguish
 * expected errors (e.g. "not found") from unexpected crashes.
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
