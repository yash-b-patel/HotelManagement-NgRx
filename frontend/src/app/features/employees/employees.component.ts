/**
 * Employees Component (standalone) — Tailwind CSS
 * Full CRUD for employees under a specific hotel.
 * Route: /hotels/:hotelId/employees
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService, Employee } from '../../core/services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-200 px-6 pb-8">
      <!-- Header -->
      <header class="flex items-center justify-between py-5 border-b border-slate-800 mb-6">
        <div class="flex items-center gap-3">
          <a routerLink="/hotels" class="text-slate-400 hover:text-slate-200 transition-colors text-sm">← Hotels</a>
          <span class="text-slate-600">|</span>
          <h1 class="text-xl font-bold">👥 Employees</h1>
        </div>
      </header>

      <!-- Add Employee Form -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <h3 class="text-slate-300 text-base font-semibold mb-4">Add New Employee</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            [(ngModel)]="newName"
            placeholder="Employee name"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <select
            [(ngModel)]="newRole"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500"
          >
            <option value="" disabled>Select role</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="chef">Chef</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>
          <input
            type="email"
            [(ngModel)]="newEmail"
            placeholder="Email (optional)"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <input
            type="text"
            [(ngModel)]="newPhone"
            placeholder="Phone (optional)"
            class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
          />
          <button
            (click)="addEmployee()"
            [disabled]="!newName || !newRole"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </div>

      <!-- Employee Table -->
      @if (isLoading()) {
        <p class="text-center text-slate-500 mt-12 text-base">Loading employees…</p>
      } @else if (employees().length === 0) {
        <p class="text-center text-slate-500 mt-12 text-base">No employees yet. Add the first one above!</p>
      } @else {
        <div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-700 text-slate-400 text-left">
                <th class="px-5 py-3 font-medium">Name</th>
                <th class="px-5 py-3 font-medium">Role</th>
                <th class="px-5 py-3 font-medium hidden sm:table-cell">Email</th>
                <th class="px-5 py-3 font-medium hidden md:table-cell">Phone</th>
                <th class="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (emp of employees(); track emp._id) {
                <tr class="border-b border-slate-700/50 hover:bg-slate-750 transition-colors">
                  <td class="px-5 py-3.5 font-medium text-slate-200">{{ emp.name }}</td>
                  <td class="px-5 py-3.5">
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="getRoleBadgeClass(emp.role)">
                      {{ emp.role }}
                    </span>
                  </td>
                  <td class="px-5 py-3.5 text-slate-400 hidden sm:table-cell">{{ emp.email || '—' }}</td>
                  <td class="px-5 py-3.5 text-slate-400 hidden md:table-cell">{{ emp.phone || '—' }}</td>
                  <td class="px-5 py-3.5 text-right">
                    <button
                      (click)="deleteEmployee(emp._id)"
                      class="text-slate-400 hover:text-red-400 text-xs cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="text-slate-500 text-xs mt-3">{{ employees().length }} employee(s) total</p>
      }
    </div>
  `,
})
export class EmployeesComponent implements OnInit {
  employees = signal<Employee[]>([]);
  isLoading = signal(true);
  hotelId = '';
  newName = '';
  newRole = '';
  newEmail = '';
  newPhone = '';

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId') || '';
    if (!this.hotelId) {
      this.router.navigate(['/hotels']);
      return;
    }
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.employeeService.getAll(this.hotelId).subscribe({
      next: (res) => {
        this.employees.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  addEmployee(): void {
    if (!this.newName || !this.newRole) return;
    this.employeeService
      .create(this.hotelId, {
        name: this.newName,
        role: this.newRole,
        email: this.newEmail || undefined,
        phone: this.newPhone || undefined,
      })
      .subscribe({
        next: (res) => {
          this.employees.update((list) => [res.data, ...list]);
          this.newName = '';
          this.newRole = '';
          this.newEmail = '';
          this.newPhone = '';
        },
      });
  }

  deleteEmployee(id: string): void {
    this.employeeService.delete(this.hotelId, id).subscribe({
      next: () => this.employees.update((list) => list.filter((e) => e._id !== id)),
    });
  }

  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      manager: 'bg-amber-500/20 text-amber-400',
      receptionist: 'bg-blue-500/20 text-blue-400',
      housekeeping: 'bg-green-500/20 text-green-400',
      chef: 'bg-orange-500/20 text-orange-400',
      security: 'bg-red-500/20 text-red-400',
      other: 'bg-slate-500/20 text-slate-400',
    };
    return map[role] || map['other'];
  }
}
