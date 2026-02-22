/**
 * Owner Service
 * -------------
 * Contains ALL business/database logic for the Owner module.
 *
 * Flow: Route → Controller → **Service** → Model → MongoDB
 *
 * Controllers never touch Mongoose directly; they delegate to these
 * functions. This keeps controllers thin and business logic testable.
 */

import jwt from 'jsonwebtoken';
import Owner from '../models/Owner.js';
import AppError from '../utils/AppError.js';

// ---------------------------------------------------------------------------
// Generate a signed JWT for the given owner ID
// ---------------------------------------------------------------------------
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ---------------------------------------------------------------------------
// Register a new owner
// ---------------------------------------------------------------------------
export const registerOwner = async ({ name, email, password }) => {
    // Check for duplicate email
    const exists = await Owner.findOne({ email });
    if (exists) {
        throw new AppError('Email already in use', 400);
    }

    const owner = await Owner.create({ name, email, password });

    // Return owner data + token (password excluded via schema `select: false`)
    const token = signToken(owner._id);
    return {
        owner: { id: owner._id, name: owner.name, email: owner.email },
        token,
    };
};

// ---------------------------------------------------------------------------
// Login an existing owner
// ---------------------------------------------------------------------------
export const loginOwner = async ({ email, password }) => {
    // Explicitly select password (excluded by default)
    const owner = await Owner.findOne({ email }).select('+password');
    if (!owner || !(await owner.comparePassword(password))) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(owner._id);
    return {
        owner: { id: owner._id, name: owner.name, email: owner.email },
        token,
    };
};

// ---------------------------------------------------------------------------
// Get owner profile by ID
// ---------------------------------------------------------------------------
export const getOwnerById = async (id) => {
    const owner = await Owner.findById(id);
    if (!owner) throw new AppError('Owner not found', 404);
    return owner;
};
