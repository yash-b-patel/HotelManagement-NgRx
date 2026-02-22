/**
 * Booking Controller
 * ------------------
 * Handles HTTP req/res for booking CRUD.
 * Delegates all business logic to bookingService.
 *
 * Supports two entry points:
 *   - Room-scoped:  /api/hotels/:hotelId/rooms/:roomId/bookings
 *   - Hotel-scoped: /api/hotels/:hotelId/bookings
 */

import * as bookingService from '../services/bookingService.js';

export const create = async (req, res, next) => {
    try {
        const booking = await bookingService.createBooking({
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            customerEmail: req.body.customerEmail,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            guests: req.body.guests,
            notes: req.body.notes,
            roomId: req.params.roomId,
            hotelId: req.params.hotelId,
            ownerId: req.owner._id,
        });
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const getAllByRoom = async (req, res, next) => {
    try {
        const bookings = await bookingService.getBookingsByRoom(
            req.params.roomId,
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};

export const getAllByHotel = async (req, res, next) => {
    try {
        const bookings = await bookingService.getBookingsByHotel(
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(
            req.params.id,
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const booking = await bookingService.updateBooking(
            req.params.id,
            req.params.hotelId,
            req.owner._id,
            req.body
        );
        res.json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await bookingService.deleteBooking(
            req.params.id,
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, message: 'Booking deleted' });
    } catch (error) {
        next(error);
    }
};
