/**
 * Auth Routes (public)
 * --------------------
 * POST /api/auth/register  → Create a new owner account
 * POST /api/auth/login     → Authenticate and receive JWT
 * GET  /api/auth/profile   → Get logged-in owner profile (protected)
 */

import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';
import protect from '../middlewares/auth.js';
import * as ownerController from '../controllers/ownerController.js';

const router = Router();

// ── Registration ──────────────────────────────────────────────────────────
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ],
    validate,
    ownerController.register
);

// ── Login ─────────────────────────────────────────────────────────────────
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    ownerController.login
);

// ── Profile (protected) ──────────────────────────────────────────────────
router.get('/profile', protect, ownerController.getProfile);

export default router;
