/**
 * Validation Middleware
 * --------------------
 * Runs express-validator checks and returns 400 with error details
 * if validation fails. Keeps validation logic out of controllers.
 *
 * Usage in routes:
 *   router.post('/', [body('name').notEmpty()], validate, controller);
 */

import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

export default validate;
