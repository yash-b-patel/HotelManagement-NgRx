/**
 * Room Service
 * ------------
 * CRUD operations for rooms scoped to a hotel.
 * Backend endpoint: /api/hotels/:hotelId/rooms
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Room {
    _id: string;
    roomNumber: string;
    type: string;
    price: number;
    isAvailable: boolean;
    hotel: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoomListResponse {
    success: boolean;
    count: number;
    data: Room[];
}

export interface RoomResponse {
    success: boolean;
    data: Room;
}

@Injectable({ providedIn: 'root' })
export class RoomService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }

    getAll(hotelId: string): Observable<RoomListResponse> {
        return this.http.get<RoomListResponse>(
            `${this.baseUrl}/hotels/${hotelId}/rooms`
        );
    }

    getById(hotelId: string, id: string): Observable<RoomResponse> {
        return this.http.get<RoomResponse>(
            `${this.baseUrl}/hotels/${hotelId}/rooms/${id}`
        );
    }

    create(
        hotelId: string,
        room: { roomNumber: string; type: string; price: number; isAvailable?: boolean }
    ): Observable<RoomResponse> {
        return this.http.post<RoomResponse>(
            `${this.baseUrl}/hotels/${hotelId}/rooms`,
            room
        );
    }

    update(
        hotelId: string,
        id: string,
        room: Partial<Room>
    ): Observable<RoomResponse> {
        return this.http.put<RoomResponse>(
            `${this.baseUrl}/hotels/${hotelId}/rooms/${id}`,
            room
        );
    }

    delete(
        hotelId: string,
        id: string
    ): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(
            `${this.baseUrl}/hotels/${hotelId}/rooms/${id}`
        );
    }
}
