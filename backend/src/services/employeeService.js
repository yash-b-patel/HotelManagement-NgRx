/**
 * Employee Service
 * ----------------
 * Business logic for employee CRUD within a hotel.
 * Verifies hotel ownership before any operation.
 */

import Employee from '../models/Employee.js';
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
export const createEmployee = async ({ name, role, email, phone, hotelId, ownerId }) => {
    await verifyHotelOwnership(hotelId, ownerId);
    return Employee.create({ name, role, email, phone, hotel: hotelId });
};

export const getEmployeesByHotel = async (hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    return Employee.find({ hotel: hotelId }).sort({ createdAt: -1 });
};

export const getEmployeeById = async (employeeId, hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const employee = await Employee.findOne({ _id: employeeId, hotel: hotelId });
    if (!employee) throw new AppError('Employee not found', 404);
    return employee;
};

export const updateEmployee = async (employeeId, hotelId, ownerId, updates) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const employee = await Employee.findOneAndUpdate(
        { _id: employeeId, hotel: hotelId },
        updates,
        { new: true, runValidators: true }
    );
    if (!employee) throw new AppError('Employee not found', 404);
    return employee;
};

export const deleteEmployee = async (employeeId, hotelId, ownerId) => {
    await verifyHotelOwnership(hotelId, ownerId);
    const employee = await Employee.findOneAndDelete({ _id: employeeId, hotel: hotelId });
    if (!employee) throw new AppError('Employee not found', 404);
    return employee;
};
