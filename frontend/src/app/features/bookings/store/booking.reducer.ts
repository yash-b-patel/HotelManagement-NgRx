/**
 * Booking Reducer
 * ---------------
 * Pure function that produces new state in response to actions.
 *
 * Uses NgRx `createReducer` + `on()` operator for type-safe
 * pattern matching. Each `on()` handles one or more actions
 * and returns a NEW state object (immutable updates).
 *
 * State transitions:
 *   ┌────────────────┐      ┌────────────────┐
 *   │  Page Action    │ ───▶ │  loading: true  │
 *   └────────────────┘      └───────┬────────┘
 *                                   │
 *                     ┌─────────────┴─────────────┐
 *                     ▼                           ▼
 *             ┌──────────────┐           ┌──────────────┐
 *             │ API Success  │           │ API Failure   │
 *             │ loading: false│          │ loading: false│
 *             │ data updated │           │ error set     │
 *             └──────────────┘           └──────────────┘
 */

import { createReducer, on } from '@ngrx/store';
import { BookingPageActions, BookingApiActions } from './booking.actions';
import { initialBookingState } from './booking.state';

export const bookingReducer = createReducer(
    initialBookingState,

    // ── LOAD BOOKINGS (hotel) ────────────────────────────────────────────
    on(BookingPageActions.loadBookings, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(BookingApiActions.loadBookingsSuccess, (state, { bookings }) => ({
        ...state,
        bookings,
        loading: false,
        error: null,
    })),
    on(BookingApiActions.loadBookingsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // ── LOAD ROOM BOOKINGS ──────────────────────────────────────────────
    on(BookingPageActions.loadRoomBookings, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(BookingApiActions.loadRoomBookingsSuccess, (state, { bookings }) => ({
        ...state,
        bookings,
        loading: false,
        error: null,
    })),
    on(BookingApiActions.loadRoomBookingsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // ── CREATE BOOKING ──────────────────────────────────────────────────
    on(BookingPageActions.createBooking, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(BookingApiActions.createBookingSuccess, (state, { booking }) => ({
        ...state,
        bookings: [...state.bookings, booking],
        loading: false,
        error: null,
    })),
    on(BookingApiActions.createBookingFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // ── UPDATE BOOKING ──────────────────────────────────────────────────
    on(BookingPageActions.updateBooking, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(BookingApiActions.updateBookingSuccess, (state, { booking }) => ({
        ...state,
        bookings: state.bookings.map((b) =>
            b._id === booking._id ? booking : b
        ),
        selectedBooking:
            state.selectedBooking?._id === booking._id
                ? booking
                : state.selectedBooking,
        loading: false,
        error: null,
    })),
    on(BookingApiActions.updateBookingFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // ── DELETE BOOKING ──────────────────────────────────────────────────
    on(BookingPageActions.deleteBooking, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(BookingApiActions.deleteBookingSuccess, (state, { bookingId }) => ({
        ...state,
        bookings: state.bookings.filter((b) => b._id !== bookingId),
        selectedBooking:
            state.selectedBooking?._id === bookingId
                ? null
                : state.selectedBooking,
        loading: false,
        error: null,
    })),
    on(BookingApiActions.deleteBookingFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // ── SELECT / CLEAR ──────────────────────────────────────────────────
    on(BookingPageActions.selectBooking, (state, { booking }) => ({
        ...state,
        selectedBooking: booking,
    })),
    on(BookingPageActions.clearSelection, (state) => ({
        ...state,
        selectedBooking: null,
    }))
);
