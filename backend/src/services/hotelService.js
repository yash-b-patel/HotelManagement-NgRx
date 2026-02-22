/**
 * Hotel Service
 * -------------
 * Business logic for hotel CRUD.
 * Only hotels belonging to the authenticated owner are accessible.
 */

import Hotel from '../models/Hotel.js';
import AppError from '../utils/AppError.js';

// ---------------------------------------------------------------------------
// Create a hotel for the authenticated owner
// ---------------------------------------------------------------------------
export const createHotel = async ({ name, address, ownerId }) => {
    const hotel = await Hotel.create({ name, address, owner: ownerId });
    return hotel;
};

// ---------------------------------------------------------------------------
// List all hotels belonging to the authenticated owner
// ---------------------------------------------------------------------------
export const getHotelsByOwner = async (ownerId) => {
    return Hotel.find({ owner: ownerId }).sort({ createdAt: -1 });
};

// ---------------------------------------------------------------------------
// Get a single hotel (must belong to the owner)
// ---------------------------------------------------------------------------
export const getHotelById = async (hotelId, ownerId) => {
    const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId });
    if (!hotel) throw new AppError('Hotel not found', 404);
    return hotel;
};

// ---------------------------------------------------------------------------
// Update a hotel
// ---------------------------------------------------------------------------
export const updateHotel = async (hotelId, ownerId, updates) => {
    const hotel = await Hotel.findOneAndUpdate(
        { _id: hotelId, owner: ownerId },
        updates,
        { new: true, runValidators: true }
    );
    if (!hotel) throw new AppError('Hotel not found', 404);
    return hotel;
};

// ---------------------------------------------------------------------------
// Delete a hotel
// ---------------------------------------------------------------------------
export const deleteHotel = async (hotelId, ownerId) => {
    const hotel = await Hotel.findOneAndDelete({ _id: hotelId, owner: ownerId });
    if (!hotel) throw new AppError('Hotel not found', 404);
    return hotel;
};
