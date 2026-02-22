/**
 * Booking Selectors
 * -----------------
 * Memoized selectors for reading data from the booking state slice.
 *
 * Selectors are pure functions that extract and derive data from the store.
 * They are memoized — NgRx caches the result and only recalculates when
 * the input state changes.
 *
 * Usage in components:
 *   bookings = this.store.select(selectAllBookings);
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingState } from './booking.state';

// ── Feature Selector ────────────────────────────────────────────────────────
// Selects the 'bookings' slice from the root AppState
export const selectBookingState =
    createFeatureSelector<BookingState>('bookings');

// ── Basic Selectors ─────────────────────────────────────────────────────────

/** All bookings in the store */
export const selectAllBookings = createSelector(
    selectBookingState,
    (state) => state.bookings
);

/** Currently selected booking */
export const selectSelectedBooking = createSelector(
    selectBookingState,
    (state) => state.selectedBooking
);

/** Loading flag */
export const selectBookingLoading = createSelector(
    selectBookingState,
    (state) => state.loading
);

/** Error message */
export const selectBookingError = createSelector(
    selectBookingState,
    (state) => state.error
);

// ── Derived / Computed Selectors ────────────────────────────────────────────

/** Total number of bookings */
export const selectBookingCount = createSelector(
    selectAllBookings,
    (bookings) => bookings.length
);

/** Only confirmed bookings */
export const selectConfirmedBookings = createSelector(
    selectAllBookings,
    (bookings) => bookings.filter((b) => b.status === 'confirmed')
);

/** Only checked-in bookings */
export const selectCheckedInBookings = createSelector(
    selectAllBookings,
    (bookings) => bookings.filter((b) => b.status === 'checked-in')
);

/** Only cancelled bookings */
export const selectCancelledBookings = createSelector(
    selectAllBookings,
    (bookings) => bookings.filter((b) => b.status === 'cancelled')
);

/** Count by status — useful for dashboard */
export const selectBookingStatusCounts = createSelector(
    selectAllBookings,
    (bookings) => ({
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        checkedIn: bookings.filter((b) => b.status === 'checked-in').length,
        checkedOut: bookings.filter((b) => b.status === 'checked-out').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    })
);

/** Total revenue from non-cancelled bookings */
export const selectTotalRevenue = createSelector(
    selectAllBookings,
    (bookings) =>
        bookings
            .filter((b) => b.status !== 'cancelled')
            .reduce((sum, b) => sum + b.totalAmount, 0)
);
