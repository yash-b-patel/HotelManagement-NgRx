/**
 * Booking Service
 * ---------------
 * HTTP operations for bookings.
 *
 * Backend endpoints:
 *   POST   /api/hotels/:hotelId/rooms/:roomId/bookings  → Create booking
 *   GET    /api/hotels/:hotelId/rooms/:roomId/bookings  → List by room
 *   GET    /api/hotels/:hotelId/bookings                → List all hotel bookings
 *   GET    /api/hotels/:hotelId/bookings/:id            → Get one
 *   PUT    /api/hotels/:hotelId/bookings/:id            → Update
 *   DELETE /api/hotels/:hotelId/bookings/:id            → Delete
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface Booking {
    _id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    notes: string;
    status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
    totalAmount: number;
    room: {
        _id: string;
        roomNumber: string;
        type: string;
        price: number;
    } | string;
    hotel: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookingPayload {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    notes?: string;
}

export interface BookingListResponse {
    success: boolean;
    count: number;
    data: Booking[];
}

export interface BookingResponse {
    success: boolean;
    data: Booking;
}

// ── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class BookingService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }

    /** Create a booking for a specific room */
    create(
        hotelId: string,
        roomId: string,
        payload: CreateBookingPayload
    ): Observable<BookingResponse> {
        return this.http.post<BookingResponse>(
            `${this.baseUrl}/hotels/${hotelId}/rooms/${roomId}/bookings`,
            payload
        );
    }

    /** Get all bookings for a specific room */
    getByRoom(hotelId: string, roomId: string): Observable<BookingListResponse> {
        return this.http.get<BookingListResponse>(
            `${this.baseUrl}/hotels/${hotelId}/rooms/${roomId}/bookings`
        );
    }

    /** Get ALL bookings for a hotel */
    getByHotel(hotelId: string): Observable<BookingListResponse> {
        return this.http.get<BookingListResponse>(
            `${this.baseUrl}/hotels/${hotelId}/bookings`
        );
    }

    /** Get a single booking */
    getById(hotelId: string, bookingId: string): Observable<BookingResponse> {
        return this.http.get<BookingResponse>(
            `${this.baseUrl}/hotels/${hotelId}/bookings/${bookingId}`
        );
    }

    /** Update a booking */
    update(
        hotelId: string,
        bookingId: string,
        updates: Partial<Booking>
    ): Observable<BookingResponse> {
        return this.http.put<BookingResponse>(
            `${this.baseUrl}/hotels/${hotelId}/bookings/${bookingId}`,
            updates
        );
    }

    /** Delete a booking */
    delete(
        hotelId: string,
        bookingId: string
    ): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(
            `${this.baseUrl}/hotels/${hotelId}/bookings/${bookingId}`
        );
    }
}
