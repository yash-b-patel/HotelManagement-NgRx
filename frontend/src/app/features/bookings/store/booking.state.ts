/**
 * Booking State Interface
 * -----------------------
 * Defines the shape of the booking slice in the NgRx store.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  AppState                                               │
 * │  └── bookings: BookingState                             │
 * │       ├── bookings: Booking[]    ← list of bookings     │
 * │       ├── selectedBooking: …     ← currently viewed     │
 * │       ├── loading: boolean       ← spinner flag         │
 * │       └── error: string | null   ← latest error msg     │
 * └─────────────────────────────────────────────────────────┘
 */

import { Booking } from '../../../core/services/booking.service';

export interface BookingState {
    bookings: Booking[];
    selectedBooking: Booking | null;
    loading: boolean;
    error: string | null;
}

export const initialBookingState: BookingState = {
    bookings: [],
    selectedBooking: null,
    loading: false,
    error: null,
};
