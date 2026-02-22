/**
 * Centralized Error Handler Middleware
 * ------------------------------------
 * Catches all errors forwarded via next(error).
 *
 * • Operational errors (AppError) → send the message and status code.
 * • Mongoose validation / cast errors → normalized to 400.
 * • Unexpected errors → generic 500 response (details logged to console).
 */

const errorHandler = (err, _req, res, _next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const messages = Object.values(err.errors).map((e) => e.message);
        message = messages.join('. ');
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for "${field}". Please use another value.`;
    }

    // Log unexpected errors in development
    if (!err.isOperational) {
        console.error('❌ UNEXPECTED ERROR:', err);
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
