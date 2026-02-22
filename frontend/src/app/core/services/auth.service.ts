/**
 * Auth Service
 * ------------
 * Handles owner authentication (login/register) and JWT token management.
 *
 * Uses Angular's HttpClient for API calls and localStorage for token
 * persistence. Exposes reactive signals for auth state consumption
 * by components.
 *
 * Provided in root so it's a singleton across the entire application.
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
    success: boolean;
    data: {
        owner: { id: string; name: string; email: string };
        token: string;
    };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly tokenKey = 'auth_token';

    /** Reactive signal holding the current token (null = logged out). */
    private readonly _token = signal<string | null>(this.getStoredToken());

    /** Whether the user is currently authenticated. */
    readonly isAuthenticated = computed(() => !!this._token());

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) { }

    // ── Public API ──────────────────────────────────────────────────────────

    register(name: string, email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password })
            .pipe(tap((res) => this.handleAuth(res)));
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(tap((res) => this.handleAuth(res)));
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this._token.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return this._token();
    }

    // ── Private helpers ─────────────────────────────────────────────────────

    private handleAuth(res: AuthResponse): void {
        const token = res.data.token;
        localStorage.setItem(this.tokenKey, token);
        this._token.set(token);
    }

    private getStoredToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.tokenKey);
    }
}
