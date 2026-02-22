/**
 * Bookings Component (standalone) — Full NgRx Integration
 * -------------------------------------------------------
 * Manages bookings for rooms within a hotel.
 * Route: /hotels/:hotelId/bookings
 *
 * NgRx usage demonstrated:
 *   ✅ Store   → injected via `inject(Store)`
 *   ✅ Actions → dispatched via `this.store.dispatch(BookingPageActions.xxx())`
 *   ✅ Selectors → read via `this.store.select(selectXxx)`
 *   ✅ Effects → handle API calls behind the scenes
 *   ✅ Reducer → produces new state immutably
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// ── NgRx Imports ────────────────────────────────────────────────────────────
import { Store } from '@ngrx/store';
import { BookingPageActions } from './store/booking.actions';
import {
    selectAllBookings,
    selectBookingLoading,
    selectBookingError,
    selectBookingStatusCounts,
    selectTotalRevenue,
} from './store/booking.selectors';

// ── Services ────────────────────────────────────────────────────────────────
import { RoomService, Room } from '../../core/services/room.service';

@Component({
    selector: 'app-bookings',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-slate-950 text-slate-200 px-6 pb-8">
      <!-- Header -->
      <header class="flex items-center justify-between py-5 border-b border-slate-800 mb-6">
        <div class="flex items-center gap-3">
          <a routerLink="/hotels" class="text-slate-400 hover:text-slate-200 transition-colors text-sm">← Hotels</a>
          <span class="text-slate-600">|</span>
          <a [routerLink]="'/hotels/' + hotelId + '/rooms'" class="text-slate-400 hover:text-slate-200 transition-colors text-sm">Rooms</a>
          <span class="text-slate-600">|</span>
          <h1 class="text-xl font-bold">📋 Bookings</h1>
        </div>
      </header>

      <!-- Status Dashboard Cards -->
      @if (statusCounts()) {
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-emerald-400">{{ statusCounts()!.confirmed }}</p>
            <p class="text-xs text-slate-400 uppercase tracking-wider mt-1">Confirmed</p>
          </div>
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-blue-400">{{ statusCounts()!.checkedIn }}</p>
            <p class="text-xs text-slate-400 uppercase tracking-wider mt-1">Checked In</p>
          </div>
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-amber-400">{{ statusCounts()!.checkedOut }}</p>
            <p class="text-xs text-slate-400 uppercase tracking-wider mt-1">Checked Out</p>
          </div>
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-purple-400">₹{{ totalRevenue() | number }}</p>
            <p class="text-xs text-slate-400 uppercase tracking-wider mt-1">Revenue</p>
          </div>
        </div>
      }

      <!-- Create Booking Form -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <h3 class="text-slate-300 text-base font-semibold mb-4">New Booking</h3>

        <!-- Room Selector -->
        <div class="mb-4">
          <select
            [(ngModel)]="selectedRoomId"
            class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500"
          >
            <option value="" disabled>Select a room</option>
            @for (room of rooms; track room._id) {
              <option [value]="room._id">
                Room {{ room.roomNumber }} — {{ room.type }} (₹{{ room.price }}/night)
                {{ room.isAvailable ? '✓ Available' : '✗ Occupied' }}
              </option>
            }
          </select>
        </div>

        <!-- Customer Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            [(ngModel)]="form.customerName"
            placeholder="Customer name *"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <input
            type="text"
            [(ngModel)]="form.customerPhone"
            placeholder="Phone number *"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <input
            type="email"
            [(ngModel)]="form.customerEmail"
            placeholder="Email (optional)"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
        </div>

        <!-- Dates & Guests -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1">Check-in *</label>
            <input
              type="date"
              [(ngModel)]="form.checkIn"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Check-out *</label>
            <input
              type="date"
              [(ngModel)]="form.checkOut"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Guests *</label>
            <input
              type="number"
              [(ngModel)]="form.guests"
              min="1"
              placeholder="1"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Notes</label>
            <input
              type="text"
              [(ngModel)]="form.notes"
              placeholder="Special requests…"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        <button
          (click)="createBooking()"
          [disabled]="!isFormValid()"
          class="mt-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Create Booking
        </button>
      </div>

      <!-- Error Message -->
      @if (error()) {
        <div class="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
          {{ error() }}
        </div>
      }

      <!-- Bookings List -->
      @if (loading()) {
        <p class="text-center text-slate-500 mt-12 text-base">Loading bookings…</p>
      } @else if (bookings()!.length === 0) {
        <p class="text-center text-slate-500 mt-12 text-base">No bookings yet. Create the first one above!</p>
      } @else {
        <div class="space-y-3">
          @for (booking of bookings(); track booking._id) {
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 transition-colors hover:border-violet-500/50">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <!-- Left: Customer & Room Info -->
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-bold">{{ booking.customerName }}</h3>
                    <span
                      class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                      [ngClass]="getStatusClass(booking.status)"
                    >
                      {{ booking.status }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                    <span>📞 {{ booking.customerPhone }}</span>
                    @if (booking.customerEmail) {
                      <span>✉️ {{ booking.customerEmail }}</span>
                    }
                    <span>
                      🏨 Room {{ getRoomNumber(booking.room) }}
                    </span>
                    <span>👥 {{ booking.guests }} guest(s)</span>
                  </div>
                  @if (booking.notes) {
                    <p class="text-xs text-slate-500 mt-1 italic">{{ booking.notes }}</p>
                  }
                </div>

                <!-- Center: Dates -->
                <div class="text-sm text-slate-300 text-center lg:min-w-[200px]">
                  <div class="flex items-center justify-center gap-2">
                    <span>{{ booking.checkIn | date:'mediumDate' }}</span>
                    <span class="text-slate-600">→</span>
                    <span>{{ booking.checkOut | date:'mediumDate' }}</span>
                  </div>
                  <p class="text-lg font-bold text-indigo-400 mt-1">₹{{ booking.totalAmount | number }}</p>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center gap-2 flex-shrink-0">
                  @if (booking.status === 'confirmed') {
                    <button
                      (click)="updateStatus(booking._id, 'checked-in')"
                      class="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors cursor-pointer"
                    >
                      Check In
                    </button>
                  }
                  @if (booking.status === 'checked-in') {
                    <button
                      (click)="updateStatus(booking._id, 'checked-out')"
                      class="px-3 py-1.5 text-xs bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors cursor-pointer"
                    >
                      Check Out
                    </button>
                  }
                  @if (booking.status !== 'cancelled' && booking.status !== 'checked-out') {
                    <button
                      (click)="updateStatus(booking._id, 'cancelled')"
                      class="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  }
                  <button
                    (click)="deleteBooking(booking._id)"
                    class="px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class BookingsComponent implements OnInit {
    // ── NgRx Store ────────────────────────────────────────────────────────
    // The Store is the single source of truth for all booking data.
    // We inject it and use selectors to read state as Signals.
    private readonly store = inject(Store);

    // ── Selectors → Signals ─────────────────────────────────────────────
    // `toSignal()` converts the Observable from `store.select()` into
    // an Angular Signal for use in the template.
    bookings = toSignal(this.store.select(selectAllBookings), { initialValue: [] });
    loading = toSignal(this.store.select(selectBookingLoading), { initialValue: false });
    error = toSignal(this.store.select(selectBookingError), { initialValue: null });
    statusCounts = toSignal(this.store.select(selectBookingStatusCounts));
    totalRevenue = toSignal(this.store.select(selectTotalRevenue), { initialValue: 0 });

    // ── Route params ────────────────────────────────────────────────────
    hotelId = '';
    rooms: Room[] = [];
    selectedRoomId = '';

    // ── Booking form model ──────────────────────────────────────────────
    form = {
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        notes: '',
    };

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly roomService = inject(RoomService);

    ngOnInit(): void {
        this.hotelId = this.route.snapshot.paramMap.get('hotelId') || '';
        if (!this.hotelId) {
            this.router.navigate(['/hotels']);
            return;
        }

        // ── Dispatch: Load all bookings for this hotel ──────────────────
        // This is the primary way we trigger data loading in NgRx.
        // The effect will handle the HTTP call and dispatch success/failure.
        this.store.dispatch(
            BookingPageActions.loadBookings({ hotelId: this.hotelId })
        );

        // Load available rooms for the booking form
        this.roomService.getAll(this.hotelId).subscribe({
            next: (res) => (this.rooms = res.data),
        });
    }

    // ── Dispatch: Create Booking ────────────────────────────────────────
    createBooking(): void {
        if (!this.isFormValid()) return;

        this.store.dispatch(
            BookingPageActions.createBooking({
                hotelId: this.hotelId,
                roomId: this.selectedRoomId,
                booking: {
                    customerName: this.form.customerName,
                    customerPhone: this.form.customerPhone,
                    customerEmail: this.form.customerEmail,
                    checkIn: this.form.checkIn,
                    checkOut: this.form.checkOut,
                    guests: this.form.guests,
                    notes: this.form.notes,
                },
            })
        );

        // Reset form
        this.form = {
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            checkIn: '',
            checkOut: '',
            guests: 1,
            notes: '',
        };
        this.selectedRoomId = '';
    }

    // ── Dispatch: Update Status ─────────────────────────────────────────
    updateStatus(bookingId: string, status: string): void {
        this.store.dispatch(
            BookingPageActions.updateBooking({
                hotelId: this.hotelId,
                bookingId,
                changes: { status: status as any },
            })
        );
    }

    // ── Dispatch: Delete Booking ────────────────────────────────────────
    deleteBooking(bookingId: string): void {
        this.store.dispatch(
            BookingPageActions.deleteBooking({
                hotelId: this.hotelId,
                bookingId,
            })
        );
    }

    // ── Template helpers ────────────────────────────────────────────────
    isFormValid(): boolean {
        return (
            !!this.selectedRoomId &&
            !!this.form.customerName &&
            !!this.form.customerPhone &&
            !!this.form.checkIn &&
            !!this.form.checkOut &&
            this.form.guests >= 1
        );
    }

    getRoomNumber(room: any): string {
        return typeof room === 'string' ? room : room?.roomNumber || '—';
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            confirmed: 'bg-emerald-500/20 text-emerald-400',
            'checked-in': 'bg-blue-500/20 text-blue-400',
            'checked-out': 'bg-amber-500/20 text-amber-400',
            cancelled: 'bg-red-500/20 text-red-400',
        };
        return map[status] || map['confirmed'];
    }
}
