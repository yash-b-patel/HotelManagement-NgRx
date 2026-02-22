/**
 * Login Component (standalone) — Tailwind CSS
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-10 w-full max-w-md shadow-2xl shadow-black/40">
        <h2 class="text-slate-200 text-center text-2xl font-bold mb-1">🏨 Hotel Management</h2>
        <h3 class="text-slate-400 text-center text-sm font-normal mb-6">Owner Login</h3>

        @if (errorMessage()) {
          <div class="bg-red-900/60 text-red-300 border border-red-800 rounded-lg px-4 py-3 mb-4 text-sm">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-5">
            <label for="email" class="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="owner&#64;example.com"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          <div class="mb-5">
            <label for="password" class="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none transition-colors focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || isLoading()"
            class="w-full py-2.5 mt-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading() ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-slate-400 mt-5 text-sm">
          Don't have an account?
          <a routerLink="/register" class="text-indigo-400 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  form: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/hotels']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
      },
    });
  }
}
