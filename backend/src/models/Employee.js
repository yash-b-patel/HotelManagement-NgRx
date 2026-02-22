/**
 * Employee Model (code-first)
 * ---------------------------
 * Represents an employee working at a specific hotel.
 *
 * Relationships:
 *   Employee  * ──── 1  Hotel  (via `hotel` ref)
 */

import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Employee name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
            enum: ['manager', 'receptionist', 'housekeeping', 'chef', 'security', 'other'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
            index: true, // fast lookups by hotel
        },
    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
