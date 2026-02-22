/**
 * Hotel Service
 * -------------
 * Provides CRUD operations for hotels via the backend REST API.
 *
 * Uses Angular's HttpClient (which is intercepted by the auth
 * interceptor to attach the JWT token automatically).
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Hotel {
    _id: string;
    name: string;
    address: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

export interface HotelListResponse {
    success: boolean;
    count: number;
    data: Hotel[];
}

export interface HotelResponse {
    success: boolean;
    data: Hotel;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
    private readonly apiUrl = `${environment.apiUrl}/hotels`;

    constructor(private readonly http: HttpClient) { }

    getAll(): Observable<HotelListResponse> {
        return this.http.get<HotelListResponse>(this.apiUrl);
    }

    getById(id: string): Observable<HotelResponse> {
        return this.http.get<HotelResponse>(`${this.apiUrl}/${id}`);
    }

    create(hotel: { name: string; address: string }): Observable<HotelResponse> {
        return this.http.post<HotelResponse>(this.apiUrl, hotel);
    }

    update(id: string, hotel: Partial<Hotel>): Observable<HotelResponse> {
        return this.http.put<HotelResponse>(`${this.apiUrl}/${id}`, hotel);
    }

    delete(id: string): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
    }
}
