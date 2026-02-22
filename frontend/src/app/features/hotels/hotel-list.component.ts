/**
 * Hotel List Component (standalone) — Tailwind CSS
 * Displays owner's hotels with add/delete and navigation to employees/rooms.
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HotelService, Hotel } from '../../core/services/hotel.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-200 px-6 pb-8">
      <!-- Header -->
      <header class="flex items-center justify-between py-5 border-b border-slate-800 mb-6">
        <h1 class="text-xl font-bold">🏨 My Hotels</h1>
        <button
          (click)="logout()"
          class="border border-slate-600 text-slate-400 px-4 py-1.5 rounded-md text-sm cursor-pointer transition-colors hover:border-red-500 hover:text-red-500"
        >
          Logout
        </button>
      </header>

      <!-- Add Hotel Form -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <h3 class="text-slate-300 text-base font-semibold mb-4">Add New Hotel</h3>
        <div class="flex flex-wrap gap-3">
          <input
            type="text"
            [(ngModel)]="newHotelName"
            placeholder="Hotel name"
            class="flex-1 min-w-[180px] px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <input
            type="text"
            [(ngModel)]="newHotelAddress"
            placeholder="Address"
            class="flex-1 min-w-[180px] px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <button
            (click)="addHotel()"
            [disabled]="!newHotelName || !newHotelAddress"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </div>

      <!-- Hotel Grid -->
      @if (isLoading()) {
        <p class="text-center text-slate-500 mt-12 text-base">Loading hotels…</p>
      } @else if (hotels().length === 0) {
        <p class="text-center text-slate-500 mt-12 text-base">No hotels yet. Add your first hotel above!</p>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (hotel of hotels(); track hotel._id) {
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 transition-colors hover:border-indigo-500">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-semibold mb-1">{{ hotel.name }}</h3>
                  <p class="text-slate-400 text-sm mb-1">📍 {{ hotel.address }}</p>
                  <span class="text-xs text-slate-500">Created {{ hotel.createdAt | date:'mediumDate' }}</span>
                </div>
                <button
                  (click)="deleteHotel(hotel._id)"
                  class="border border-slate-600 text-slate-400 px-3 py-1 rounded-md text-xs cursor-pointer transition-colors hover:border-red-500 hover:text-red-500 shrink-0 ml-3"
                >
                  Delete
                </button>
              </div>
              <div class="flex gap-2 mt-4 pt-3 border-t border-slate-700">
                <a
                  [routerLink]="['/hotels', hotel._id, 'employees']"
                  class="flex-1 text-center py-1.5 text-xs font-medium text-indigo-400 border border-indigo-500/30 rounded-md hover:bg-indigo-500/10 transition-colors"
                >
                  👥 Employees
                </a>
                <a
                  [routerLink]="['/hotels', hotel._id, 'rooms']"
                  class="flex-1 text-center py-1.5 text-xs font-medium text-violet-400 border border-violet-500/30 rounded-md hover:bg-violet-500/10 transition-colors"
                >
                  🚪 Rooms
                </a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class HotelListComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  isLoading = signal(true);
  newHotelName = '';
  newHotelAddress = '';

  constructor(
    private readonly hotelService: HotelService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading.set(true);
    this.hotelService.getAll().subscribe({
      next: (res) => {
        this.hotels.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  addHotel(): void {
    if (!this.newHotelName || !this.newHotelAddress) return;
    this.hotelService.create({ name: this.newHotelName, address: this.newHotelAddress }).subscribe({
      next: (res) => {
        this.hotels.update((list) => [res.data, ...list]);
        this.newHotelName = '';
        this.newHotelAddress = '';
      },
    });
  }

  deleteHotel(id: string): void {
    this.hotelService.delete(id).subscribe({
      next: () => this.hotels.update((list) => list.filter((h) => h._id !== id)),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
