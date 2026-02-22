/**
 * Express Application Setup
 * -------------------------
 * Configures Express with:
 *   1. JSON body parser
 *   2. CORS (allows Angular dev server on port 4200)
 *   3. Route mounting
 *   4. Centralized error handler (must be registered LAST)
 *
 * This file does NOT start the server — that is server.js's job.
 */

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import hotelRoutes from './routes/hotel.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import roomRoutes from './routes/room.routes.js';
import { roomBookingRouter, hotelBookingRouter } from './routes/booking.routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/hotels/:hotelId/employees', employeeRoutes);
app.use('/api/hotels/:hotelId/rooms', roomRoutes);
app.use('/api/hotels/:hotelId/rooms/:roomId/bookings', roomBookingRouter);
app.use('/api/hotels/:hotelId/bookings', hotelBookingRouter);

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 catch-all ─────────────────────────────────────────────────────────
app.all('*', (req, _res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

// ── Centralized Error Handler (must be LAST) ──────────────────────────────
app.use(errorHandler);

export default app;
