/**
 * Owner Model (code-first)
 * ------------------------
 * Represents an owner who can own multiple hotels.
 *
 * Code-first approach: Mongoose creates the "owners" collection
 * automatically when the first document is saved. No manual DB
 * setup is needed — the schema below IS the source of truth.
 *
 * Relationships:
 *   Owner  1 ──── * Hotel   (Hotel.owner references Owner._id)
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ownerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true, // creates a unique index
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false, // excluded from queries by default
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt automatically
    }
);

// ---------------------------------------------------------------------------
// Middleware – hash password before saving
// ---------------------------------------------------------------------------
ownerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// ---------------------------------------------------------------------------
// Instance method – compare candidate password with stored hash
// ---------------------------------------------------------------------------
ownerSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Owner = mongoose.model('Owner', ownerSchema);
export default Owner;
