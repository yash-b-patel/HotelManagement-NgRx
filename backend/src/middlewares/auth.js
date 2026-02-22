/**
 * Authentication Middleware
 * ------------------------
 * Verifies the JWT from the `Authorization: Bearer <token>` header
 * and attaches the owner document to `req.owner`.
 *
 * All protected routes use this middleware before the controller runs.
 */

import jwt from 'jsonwebtoken';
import Owner from '../models/Owner.js';
import AppError from '../utils/AppError.js';

const protect = async (req, _res, next) => {
    try {
        // 1) Extract token from header
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError('Not authenticated. Please log in.', 401);
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if owner still exists
        const owner = await Owner.findById(decoded.id);
        if (!owner) {
            throw new AppError('Owner no longer exists.', 401);
        }

        // 4) Attach owner to request
        req.owner = owner;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token.', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token has expired.', 401));
        }
        next(error);
    }
};

export default protect;
