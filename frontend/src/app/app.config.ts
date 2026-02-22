/**
 * Application Config
 * ------------------
 * Provides:
 *   1. Router with lazy-loaded routes
 *   2. HttpClient with the JWT auth interceptor
 *   3. NgRx Store with feature reducers
 *   4. NgRx Effects for side-effect management
 *   5. NgRx StoreDevtools for debugging (Redux DevTools)
 *
 * This is the standalone equivalent of the old AppModule's providers array.
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// ── NgRx Imports ────────────────────────────────────────────────────────────
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// ── NgRx Reducer & Effects ──────────────────────────────────────────────────
import { bookingReducer } from './features/bookings/store/booking.reducer';
import * as bookingEffects from './features/bookings/store/booking.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // ── NgRx Store ────────────────────────────────────────────────────
    // Register feature reducers. The key 'bookings' becomes the
    // feature name used in `createFeatureSelector('bookings')`.
    provideStore({
      bookings: bookingReducer,
    }),

    // ── NgRx Effects ──────────────────────────────────────────────────
    // Register all booking effects (functional effects).
    // Each effect listens for specific actions and triggers API calls.
    provideEffects(bookingEffects),

    // ── NgRx Store Devtools ───────────────────────────────────────────
    // Enables Redux DevTools browser extension for debugging.
    // Only active in development mode for security.
    provideStoreDevtools({
      maxAge: 25,           // Retains last 25 states
      logOnly: !isDevMode(), // Restrict to log-only in production
    }),
  ],
};
