/**
 * Booking Actions
 * ---------------
 * All NgRx actions for the booking feature.
 *
 * Each API operation has three actions following the pattern:
 *   [Trigger]         → dispatched by the component
 *   [Success]         → dispatched by the effect on API success
 *   [Failure]         → dispatched by the effect on API error
 *
 * Action naming convention:  [Source] Description
 *   [Bookings Page]  = dispatched from the component
 *   [Bookings API]   = dispatched from the effect
 */

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Booking, CreateBookingPayload } from '../../../core/services/booking.service';

// ── Page Actions (dispatched by components) ─────────────────────────────────
export const BookingPageActions = createActionGroup({
    source: 'Bookings Page',
    events: {
        /** Load all bookings for a hotel */
        'Load Bookings': props<{ hotelId: string }>(),

        /** Load bookings for a specific room */
        'Load Room Bookings': props<{ hotelId: string; roomId: string }>(),

        /** Create a new booking */
        'Create Booking': props<{
            hotelId: string;
            roomId: string;
            booking: CreateBookingPayload;
        }>(),

        /** Update an existing booking (e.g. change status) */
        'Update Booking': props<{
            hotelId: string;
            bookingId: string;
            changes: Partial<Booking>;
        }>(),

        /** Delete a booking */
        'Delete Booking': props<{ hotelId: string; bookingId: string }>(),

        /** Select a booking for detail view */
        'Select Booking': props<{ booking: Booking }>(),

        /** Clear selection */
        'Clear Selection': emptyProps(),
    },
});

// ── API Actions (dispatched by effects) ─────────────────────────────────────
export const BookingApiActions = createActionGroup({
    source: 'Bookings API',
    events: {
        /** Bookings loaded successfully */
        'Load Bookings Success': props<{ bookings: Booking[] }>(),
        'Load Bookings Failure': props<{ error: string }>(),

        /** Room bookings loaded successfully */
        'Load Room Bookings Success': props<{ bookings: Booking[] }>(),
        'Load Room Bookings Failure': props<{ error: string }>(),

        /** Booking created successfully */
        'Create Booking Success': props<{ booking: Booking }>(),
        'Create Booking Failure': props<{ error: string }>(),

        /** Booking updated successfully */
        'Update Booking Success': props<{ booking: Booking }>(),
        'Update Booking Failure': props<{ error: string }>(),

        /** Booking deleted successfully */
        'Delete Booking Success': props<{ bookingId: string }>(),
        'Delete Booking Failure': props<{ error: string }>(),
    },
});
