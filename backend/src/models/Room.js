/**
 * Room Model (code-first)
 * -----------------------
 * Represents a room inside a hotel with pricing and availability.
 *
 * Relationships:
 *   Room  * ──── 1  Hotel  (via `hotel` ref)
 */

import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: [true, 'Room number is required'],
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Room type is required'],
            enum: ['single', 'double', 'suite', 'deluxe'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
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

const Room = mongoose.model('Room', roomSchema);
export default Room;
