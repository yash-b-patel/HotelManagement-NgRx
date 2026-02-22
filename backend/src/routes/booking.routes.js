/**
 * Booking Routes (protected, nested under hotel + room)
 * -----------------------------------------------------
 * All routes require JWT authentication.
 * Bookings are scoped to a hotel and optionally a room.
 *
 * Room-scoped (mounted at /api/hotels/:hotelId/rooms/:roomId/bookings):
 *   GET    /                          → List bookings for room
 *   POST   /                          → Create booking for room
 *
 * Hotel-scoped (mounted at /api/hotels/:hotelId/bookings):
 *   GET    /                          → List ALL bookings for hotel
 *   GET    /:id                       → Get booking details
 *   PUT    /:id                       → Update booking (status, dates, etc.)
 *   DELETE /:id                       → Delete booking
 */

import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';
import protect from '../middlewares/auth.js';
import * as bookingController from '../controllers/bookingController.js';

// ── Room-scoped router ───────────────────────────────────────────────────────
export const roomBookingRouter = Router({ mergeParams: true });

roomBookingRouter.use(protect);

roomBookingRouter.get('/', bookingController.getAllByRoom);

roomBookingRouter.post(
    '/',
    [
        body('customerName')
            .notEmpty()
            .withMessage('Customer name is required'),
        body('customerPhone')
            .notEmpty()
            .withMessage('Customer phone is required'),
        body('checkIn')
            .notEmpty()
            .withMessage('Check-in date is required')
            .isISO8601()
            .withMessage('Check-in must be a valid date'),
        body('checkOut')
            .notEmpty()
            .withMessage('Check-out date is required')
            .isISO8601()
            .withMessage('Check-out must be a valid date'),
        body('guests')
            .isInt({ min: 1 })
            .withMessage('Guests must be at least 1'),
    ],
    validate,
    bookingController.create
);

// ── Hotel-scoped router ──────────────────────────────────────────────────────
export const hotelBookingRouter = Router({ mergeParams: true });

hotelBookingRouter.use(protect);

hotelBookingRouter.get('/', bookingController.getAllByHotel);
hotelBookingRouter.get('/:id', bookingController.getOne);
hotelBookingRouter.put('/:id', bookingController.update);
hotelBookingRouter.delete('/:id', bookingController.remove);
