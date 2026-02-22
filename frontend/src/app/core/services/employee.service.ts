/**
 * Employee Service
 * ----------------
 * CRUD operations for employees scoped to a hotel.
 * Backend endpoint: /api/hotels/:hotelId/employees
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Employee {
    _id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    hotel: string;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeListResponse {
    success: boolean;
    count: number;
    data: Employee[];
}

export interface EmployeeResponse {
    success: boolean;
    data: Employee;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }

    getAll(hotelId: string): Observable<EmployeeListResponse> {
        return this.http.get<EmployeeListResponse>(
            `${this.baseUrl}/hotels/${hotelId}/employees`
        );
    }

    getById(hotelId: string, id: string): Observable<EmployeeResponse> {
        return this.http.get<EmployeeResponse>(
            `${this.baseUrl}/hotels/${hotelId}/employees/${id}`
        );
    }

    create(
        hotelId: string,
        employee: { name: string; role: string; email?: string; phone?: string }
    ): Observable<EmployeeResponse> {
        return this.http.post<EmployeeResponse>(
            `${this.baseUrl}/hotels/${hotelId}/employees`,
            employee
        );
    }

    update(
        hotelId: string,
        id: string,
        employee: Partial<Employee>
    ): Observable<EmployeeResponse> {
        return this.http.put<EmployeeResponse>(
            `${this.baseUrl}/hotels/${hotelId}/employees/${id}`,
            employee
        );
    }

    delete(
        hotelId: string,
        id: string
    ): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(
            `${this.baseUrl}/hotels/${hotelId}/employees/${id}`
        );
    }
}
