/**
 * Room Routes (protected, nested under hotel)
 * --------------------------------------------
 * All routes require JWT authentication.
 * Rooms are scoped to a hotel via :hotelId param.
 *
 * GET    /api/hotels/:hotelId/rooms        → List rooms
 * POST   /api/hotels/:hotelId/rooms        → Add room
 * GET    /api/hotels/:hotelId/rooms/:id    → Get room
 * PUT    /api/hotels/:hotelId/rooms/:id    → Update room
 * DELETE /api/hotels/:hotelId/rooms/:id    → Delete room
 */

import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';
import protect from '../middlewares/auth.js';
import * as roomController from '../controllers/roomController.js';

const router = Router({ mergeParams: true });

router.use(protect);

router.post(
    '/',
    [
        body('roomNumber').notEmpty().withMessage('Room number is required'),
        body('type')
            .notEmpty()
            .withMessage('Room type is required')
            .isIn(['single', 'double', 'suite', 'deluxe'])
            .withMessage('Invalid room type'),
        body('price').isNumeric().withMessage('Price must be a number'),
    ],
    validate,
    roomController.create
);

router.get('/', roomController.getAll);
router.get('/:id', roomController.getOne);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.remove);

export default router;
