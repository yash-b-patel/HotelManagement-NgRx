/**
 * Hotel Routes (protected)
 * ------------------------
 * All routes require JWT authentication via the `protect` middleware.
 *
 * GET    /api/hotels        → List owner's hotels
 * POST   /api/hotels        → Create a hotel
 * GET    /api/hotels/:id    → Get hotel details
 * PUT    /api/hotels/:id    → Update a hotel
 * DELETE /api/hotels/:id    → Delete a hotel
 */

import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';
import protect from '../middlewares/auth.js';
import * as hotelController from '../controllers/hotelController.js';

const router = Router();

// All hotel routes are protected
router.use(protect);

router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Hotel name is required'),
        body('address').notEmpty().withMessage('Address is required'),
    ],
    validate,
    hotelController.create
);

router.get('/', hotelController.getAll);
router.get('/:id', hotelController.getOne);
router.put('/:id', hotelController.update);
router.delete('/:id', hotelController.remove);

export default router;
