/**
 * Hotel Model (code-first)
 * ------------------------
 * Represents a hotel belonging to one Owner.
 *
 * Relationships:
 *   Hotel  * ──── 1  Owner     (via `owner` ref)
 *   Hotel  1 ──── *  Employee  (Employee.hotel references Hotel._id)
 *   Hotel  1 ──── *  Room      (Room.hotel references Hotel._id)
 */

import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Hotel name is required'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Owner',
            required: true,
            index: true, // index for fast lookups by owner
        },
    },
    {
        timestamps: true,
    }
);

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
