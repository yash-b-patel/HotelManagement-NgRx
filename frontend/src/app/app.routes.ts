/**
 * Application Routes
 * ------------------
 * Lazy-loaded feature routes for scalability.
 * Employees and Rooms are nested under /hotels/:hotelId.
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register.component').then((m) => m.RegisterComponent),
    },
    {
        path: 'hotels',
        loadComponent: () =>
            import('./features/hotels/hotel-list.component').then((m) => m.HotelListComponent),
    },
    {
        path: 'hotels/:hotelId/employees',
        loadComponent: () =>
            import('./features/employees/employees.component').then((m) => m.EmployeesComponent),
    },
    {
        path: 'hotels/:hotelId/rooms',
        loadComponent: () =>
            import('./features/rooms/rooms.component').then((m) => m.RoomsComponent),
    },
    {
        path: 'hotels/:hotelId/bookings',
        loadComponent: () =>
            import('./features/bookings/bookings.component').then((m) => m.BookingsComponent),
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' },
];
