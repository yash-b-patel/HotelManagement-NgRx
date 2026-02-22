/**
 * Booking Effects
 * ---------------
 * Side-effect handlers powered by @ngrx/effects.
 *
 * Effects listen for PAGE actions, call the BookingService,
 * and dispatch API success/failure actions in response.
 *
 * Flow:
 *   Component → dispatch(PageAction) → Effect listens → calls HTTP API
 *       → on success → dispatch(ApiSuccessAction)
 *       → on error   → dispatch(ApiFailureAction)
 *
 * Uses functional `createEffect()` style (NgRx 15+).
 */

import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { BookingService } from '../../../core/services/booking.service';
import { BookingPageActions, BookingApiActions } from './booking.actions';

// ── Load Bookings (all hotel bookings) ──────────────────────────────────────
export const loadBookings = createEffect(
    (actions$ = inject(Actions), bookingService = inject(BookingService)) =>
        actions$.pipe(
            ofType(BookingPageActions.loadBookings),
            switchMap(({ hotelId }) =>
                bookingService.getByHotel(hotelId).pipe(
                    map((response) =>
                        BookingApiActions.loadBookingsSuccess({
                            bookings: response.data,
                        })
                    ),
                    catchError((error) =>
                        of(
                            BookingApiActions.loadBookingsFailure({
                                error:
                                    error?.error?.message ||
                                    'Failed to load bookings',
                            })
                        )
                    )
                )
            )
        ),
    { functional: true }
);

// ── Load Room Bookings ──────────────────────────────────────────────────────
export const loadRoomBookings = createEffect(
    (actions$ = inject(Actions), bookingService = inject(BookingService)) =>
        actions$.pipe(
            ofType(BookingPageActions.loadRoomBookings),
            switchMap(({ hotelId, roomId }) =>
                bookingService.getByRoom(hotelId, roomId).pipe(
                    map((response) =>
                        BookingApiActions.loadRoomBookingsSuccess({
                            bookings: response.data,
                        })
                    ),
                    catchError((error) =>
                        of(
                            BookingApiActions.loadRoomBookingsFailure({
                                error:
                                    error?.error?.message ||
                                    'Failed to load room bookings',
                            })
                        )
                    )
                )
            )
        ),
    { functional: true }
);

// ── Create Booking ──────────────────────────────────────────────────────────
export const createBooking = createEffect(
    (actions$ = inject(Actions), bookingService = inject(BookingService)) =>
        actions$.pipe(
            ofType(BookingPageActions.createBooking),
            exhaustMap(({ hotelId, roomId, booking }) =>
                bookingService.create(hotelId, roomId, booking).pipe(
                    map((response) =>
                        BookingApiActions.createBookingSuccess({
                            booking: response.data,
                        })
                    ),
                    catchError((error) =>
                        of(
                            BookingApiActions.createBookingFailure({
                                error:
                                    error?.error?.message ||
                                    'Failed to create booking',
                            })
                        )
                    )
                )
            )
        ),
    { functional: true }
);

// ── Update Booking ──────────────────────────────────────────────────────────
export const updateBooking = createEffect(
    (actions$ = inject(Actions), bookingService = inject(BookingService)) =>
        actions$.pipe(
            ofType(BookingPageActions.updateBooking),
            mergeMap(({ hotelId, bookingId, changes }) =>
                bookingService.update(hotelId, bookingId, changes).pipe(
                    map((response) =>
                        BookingApiActions.updateBookingSuccess({
                            booking: response.data,
                        })
                    ),
                    catchError((error) =>
                        of(
                            BookingApiActions.updateBookingFailure({
                                error:
                                    error?.error?.message ||
                                    'Failed to update booking',
                            })
                        )
                    )
                )
            )
        ),
    { functional: true }
);

// ── Delete Booking ──────────────────────────────────────────────────────────
export const deleteBooking = createEffect(
    (actions$ = inject(Actions), bookingService = inject(BookingService)) =>
        actions$.pipe(
            ofType(BookingPageActions.deleteBooking),
            mergeMap(({ hotelId, bookingId }) =>
                bookingService.delete(hotelId, bookingId).pipe(
                    map(() =>
                        BookingApiActions.deleteBookingSuccess({ bookingId })
                    ),
                    catchError((error) =>
                        of(
                            BookingApiActions.deleteBookingFailure({
                                error:
                                    error?.error?.message ||
                                    'Failed to delete booking',
                            })
                        )
                    )
                )
            )
        ),
    { functional: true }
);
