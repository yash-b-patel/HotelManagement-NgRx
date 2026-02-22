/**
 * Booking Model (code-first)
 * --------------------------
 * Represents a booking/reservation for a specific room in a hotel.
 *
 * Relationships:
 *   Booking  * ──── 1  Room   (via `room` ref)
 *   Booking  * ──── 1  Hotel  (via `hotel` ref)
 */

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        customerPhone: {
            type: String,
            required: [true, 'Customer phone is required'],
            trim: true,
        },
        customerEmail: {
            type: String,
            trim: true,
            lowercase: true,
            default: '',
        },
        checkIn: {
            type: Date,
            required: [true, 'Check-in date is required'],
        },
        checkOut: {
            type: Date,
            required: [true, 'Check-out date is required'],
        },
        guests: {
            type: Number,
            required: [true, 'Number of guests is required'],
            min: [1, 'At least 1 guest is required'],
        },
        notes: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
            default: 'confirmed',
        },
        totalAmount: {
            type: Number,
            min: 0,
            default: 0,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
            index: true,
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Validate checkOut is after checkIn
bookingSchema.pre('validate', function (next) {
    if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
        this.invalidate('checkOut', 'Check-out must be after check-in');
    }
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
