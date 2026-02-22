/**
 * Auth Interceptor (functional)
 * -----------------------------
 * Intercepts all outgoing HTTP requests and attaches the JWT token
 * from AuthService as a Bearer token in the Authorization header.
 *
 * Uses the modern Angular functional interceptor style (Angular 15+).
 * Registered via `provideHttpClient(withInterceptors([...]))` in app.config.ts.
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next(cloned);
    }

    return next(req);
};
