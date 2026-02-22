/**
 * Booking Service
 * ---------------
 * Business logic for booking CRUD within a room of a hotel.
 * Verifies hotel ownership and room existence before any operation.
 * Automatically calculates totalAmount from room price × nights.
 */

import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import AppError from '../utils/AppError.js';

// ---------------------------------------------------------------------------
// Helper – verify the hotel belongs to the authenticated owner
// ---------------------------------------------------------------------------
const verifyHotelOwnership = async (hotelId, ownerId) => {
    const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId });
    if (!hotel) throw new AppError('Hotel not found or access denied', 404);
    return hotel;
};

// ---------------------------------------------------------------------------
// Helper – verify the room belongs to the hotel
// ---------------------------------------------------------------------------
const verifyRoom = async (roomId, hotelId) => {
    const room = await Room.findOne({ _id: roomId, hotel: hotelId });
    if (!room) throw new AppError('Room not found in this hotel', 404);
    return room;
};

// ---------------------------------------------------------------------------
// Helper – calculate total from room price × number of nights
// ---------------------------------------------------------------------------
const calculateTotal = (room, checkIn, checkOut) => {
    const nights = Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    return room.price * Math.max(nights, 1);
};

// ---------------------------------------------------------------------------
export const createBooking = async ({
    customerName,
    customerPhone,
    customerEmail,
    checkIn,
    checkOut,
    guests,
    notes,
    roomId,
    hotelId,
    ownerId,
}) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const room = await verifyRoom(roomId, hotelId);

    const totalAmount = calculateTotal(room, checkIn, checkOut);

    const booking = await Booking.create({
        customerName,
        customerPhone,
        customerEmail,
        checkIn,
        checkOut,
        guests,
        notes,
        totalAmount,
        room: roomId,
        hotel: hotelId,
    });

    // Mark room as occupied
    await Room.findByIdAndUpdate(roomId, { isAvailable: false });

    return booking;
};

export const getBookingsByRoom = async (roomId, hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    await verifyRoom(roomId, hotelId);
    return Booking.find({ room: roomId, hotel: hotelId })
        .sort({ checkIn: -1 })
        .populate('room', 'roomNumber type price');
};

export const getBookingsByHotel = async (hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    return Booking.find({ hotel: hotelId })
        .sort({ checkIn: -1 })
        .populate('room', 'roomNumber type price');
};

export const getBookingById = async (bookingId, hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const booking = await Booking.findOne({ _id: bookingId, hotel: hotelId })
        .populate('room', 'roomNumber type price');
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
};

export const updateBooking = async (bookingId, hotelId, ownerId, updates) => {
    await verifyHotelOwnership(hotelId, ownerId);

    const booking = await Booking.findOne({ _id: bookingId, hotel: hotelId });
    if (!booking) throw new AppError('Booking not found', 404);

    // If status changed to 'checked-out' or 'cancelled', free the room
    if (
        updates.status &&
        ['checked-out', 'cancelled'].includes(updates.status)
    ) {
        await Room.findByIdAndUpdate(booking.room, { isAvailable: true });
    }

    // If status changed to 'confirmed' or 'checked-in', mark room occupied
    if (
        updates.status &&
        ['confirmed', 'checked-in'].includes(updates.status)
    ) {
        await Room.findByIdAndUpdate(booking.room, { isAvailable: false });
    }

    const updated = await Booking.findByIdAndUpdate(bookingId, updates, {
        new: true,
        runValidators: true,
    }).populate('room', 'roomNumber type price');

    return updated;
};

export const deleteBooking = async (bookingId, hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const booking = await Booking.findOneAndDelete({
        _id: bookingId,
        hotel: hotelId,
    });
    if (!booking) throw new AppError('Booking not found', 404);

    // Free the room when booking is deleted
    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    return booking;
};
