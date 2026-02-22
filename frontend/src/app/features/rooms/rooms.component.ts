/**
 * Rooms Component (standalone) — Tailwind CSS
 * Full CRUD for rooms under a specific hotel.
 * Route: /hotels/:hotelId/rooms
 */

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService, Room } from '../../core/services/room.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-200 px-6 pb-8">
      <!-- Header -->
      <header class="flex items-center justify-between py-5 border-b border-slate-800 mb-6">
        <div class="flex items-center gap-3">
          <a routerLink="/hotels" class="text-slate-400 hover:text-slate-200 transition-colors text-sm">← Hotels</a>
          <span class="text-slate-600">|</span>
          <h1 class="text-xl font-bold">🚪 Rooms</h1>
        </div>
        <a
          [routerLink]="'/hotels/' + hotelId + '/bookings'"
          class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90"
        >
          📋 Bookings
        </a>
      </header>

      <!-- Add Room Form -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <h3 class="text-slate-300 text-base font-semibold mb-4">Add New Room</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            [(ngModel)]="newRoomNumber"
            placeholder="Room number"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <select
            [(ngModel)]="newType"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500"
          >
            <option value="" disabled>Room type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="deluxe">Deluxe</option>
          </select>
          <input
            type="number"
            [(ngModel)]="newPrice"
            placeholder="Price per night"
            min="0"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <label class="flex items-center gap-2 text-sm text-slate-300 px-2">
            <input
              type="checkbox"
              [(ngModel)]="newIsAvailable"
              class="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-500 focus:ring-indigo-500 accent-indigo-500"
            />
            Available
          </label>
          <button
            (click)="addRoom()"
            [disabled]="!newRoomNumber || !newType || newPrice === null || newPrice < 0"
            class="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </div>

      <!-- Room Grid -->
      @if (isLoading()) {
        <p class="text-center text-slate-500 mt-12 text-base">Loading rooms…</p>
      } @else if (rooms().length === 0) {
        <p class="text-center text-slate-500 mt-12 text-base">No rooms yet. Add the first one above!</p>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (room of rooms(); track room._id) {
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 transition-colors hover:border-violet-500 relative">
              <!-- Availability badge -->
              <span
                class="absolute top-3 right-3 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                [class]="room.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'"
              >
                {{ room.isAvailable ? 'Available' : 'Occupied' }}
              </span>

              <p class="text-xs text-slate-500 mb-1 uppercase tracking-wider">Room</p>
              <h3 class="text-2xl font-bold mb-2">{{ room.roomNumber }}</h3>

              <div class="flex items-center gap-3 mb-3">
                <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="getTypeBadgeClass(room.type)">
                  {{ room.type }}
                </span>
                <span class="text-lg font-semibold text-indigo-400">₹{{ room.price }}</span>
                <span class="text-xs text-slate-500">/night</span>
              </div>

              <div class="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
                <button
                  (click)="toggleAvailability(room)"
                  class="text-xs text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  {{ room.isAvailable ? 'Mark Occupied' : 'Mark Available' }}
                </button>
                <button
                  (click)="deleteRoom(room._id)"
                  class="text-xs text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
        <p class="text-slate-500 text-xs mt-3">
          {{ rooms().length }} room(s) total ·
          {{ availableCount() }} available
        </p>
      }
    </div>
  `,
})
export class RoomsComponent implements OnInit {
  rooms = signal<Room[]>([]);
  availableCount = computed(() => this.rooms().filter(r => r.isAvailable).length);
  isLoading = signal(true);
  hotelId = '';
  newRoomNumber = '';
  newType = '';
  newPrice: number | null = null;
  newIsAvailable = true;

  constructor(
    private readonly roomService: RoomService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId') || '';
    if (!this.hotelId) {
      this.router.navigate(['/hotels']);
      return;
    }
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading.set(true);
    this.roomService.getAll(this.hotelId).subscribe({
      next: (res) => {
        this.rooms.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  addRoom(): void {
    if (!this.newRoomNumber || !this.newType || this.newPrice === null || this.newPrice < 0) return;
    this.roomService
      .create(this.hotelId, {
        roomNumber: this.newRoomNumber,
        type: this.newType,
        price: this.newPrice,
        isAvailable: this.newIsAvailable,
      })
      .subscribe({
        next: (res) => {
          this.rooms.update((list) => [...list, res.data]);
          this.newRoomNumber = '';
          this.newType = '';
          this.newPrice = null;
          this.newIsAvailable = true;
        },
      });
  }

  toggleAvailability(room: Room): void {
    this.roomService
      .update(this.hotelId, room._id, { isAvailable: !room.isAvailable })
      .subscribe({
        next: (res) => {
          this.rooms.update((list) =>
            list.map((r) => (r._id === room._id ? res.data : r))
          );
        },
      });
  }

  deleteRoom(id: string): void {
    this.roomService.delete(this.hotelId, id).subscribe({
      next: () => this.rooms.update((list) => list.filter((r) => r._id !== id)),
    });
  }

  getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      single: 'bg-slate-500/20 text-slate-300',
      double: 'bg-blue-500/20 text-blue-400',
      suite: 'bg-amber-500/20 text-amber-400',
      deluxe: 'bg-purple-500/20 text-purple-400',
    };
    return map[type] || map['single'];
  }
}
