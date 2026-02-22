/**
 * Room Service
 * ------------
 * Business logic for room CRUD within a hotel.
 * Verifies hotel ownership before any operation.
 */

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
export const createRoom = async ({ roomNumber, type, price, isAvailable, hotelId, ownerId }) => {
    await verifyHotelOwnership(hotelId, ownerId);
    return Room.create({ roomNumber, type, price, isAvailable, hotel: hotelId });
};

export const getRoomsByHotel = async (hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    return Room.find({ hotel: hotelId }).sort({ roomNumber: 1 });
};

export const getRoomById = async (roomId, hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const room = await Room.findOne({ _id: roomId, hotel: hotelId });
    if (!room) throw new AppError('Room not found', 404);
    return room;
};

export const updateRoom = async (roomId, hotelId, ownerId, updates) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const room = await Room.findOneAndUpdate(
        { _id: roomId, hotel: hotelId },
        updates,
        { new: true, runValidators: true }
    );
    if (!room) throw new AppError('Room not found', 404);
    return room;
};

export const deleteRoom = async (roomId, hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const room = await Room.findOneAndDelete({ _id: roomId, hotel: hotelId });
    if (!room) throw new AppError('Room not found', 404);
    return room;
};
