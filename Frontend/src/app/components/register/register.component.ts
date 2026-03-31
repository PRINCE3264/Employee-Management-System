import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-wrapper d-flex align-items-center justify-content-center" style="min-height: calc(100vh - 76px);">
      <div class="auth-card glass p-4 shadow-lg animate-fade-in" style="width: 100%; max-width: 420px;">
        <div class="text-center mb-3">
          <div class="auth-icon bg-primary text-white rounded-4 shadow-sm mb-2" style="width: 60px; height: 60px;">
             <i class="bi bi-person-plus-fill fs-2"></i>
          </div>
          <h2 class="fw-bold text-main mb-0">Join Staff<span class="text-primary">Sphere</span></h2>
          <p class="text-muted small mb-0">Create your account</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="mb-2">
            <label class="form-label small fw-bold text-muted text-uppercase mb-1">Full Name</label>
            <div class="input-group-custom">
              <i class="bi bi-person text-muted"></i>
              <input type="text" formControlName="name" class="form-control-custom" placeholder="John Doe">
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label small fw-bold text-muted text-uppercase mb-1">Email address</label>
            <div class="input-group-custom">
              <i class="bi bi-envelope text-muted"></i>
              <input type="email" formControlName="email" class="form-control-custom" placeholder="email@example.com">
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-muted text-uppercase mb-1">Password</label>
            <div class="input-group-custom">
              <i class="bi bi-lock text-muted"></i>
              <input type="password" formControlName="password" class="form-control-custom" placeholder="••••••••">
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3" [disabled]="loading || registerForm.invalid">
             <span *ngIf="loading" class="spinner-border spinner-border-sm"></span>
             <span *ngIf="!loading">Create My Account</span>
          </button>
          
          <div class="text-center">
            <span class="text-muted small">Already have an account? </span>
            <a routerLink="/login" class="text-primary fw-bold text-decoration-none small ms-1">Sign In instead</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { 
      background: radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.05) 0%, rgba(248, 250, 252, 1) 90%);
      position: relative;
      overflow: hidden;
      min-height: calc(100vh - 76px);
    }
    .auth-wrapper::before {
      content: '';
      position: absolute;
      bottom: -10%; right: -10%;
      width: 40%; height: 40%;
      background: var(--primary-soft);
      filter: blur(120px);
      border-radius: 50%;
      z-index: 0;
    }
    .auth-card { z-index: 1; border-radius: 24px; border: 1px solid var(--glass-border) !important; width: 92% !important; }
    .auth-icon { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; margin: 0 auto; transform: rotate(5deg); }
    .input-group-custom {
      position: relative;
      background: var(--bg-main);
      border-radius: 12px;
      border: 1px solid var(--border-light);
      padding: 0 1rem;
      display: flex; align-items: center;
      transition: all 0.2s;
    }
    .input-group-custom:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px var(--primary-soft);
      background: var(--bg-card);
    }
    .input-group-custom i { font-size: 1.1rem; margin-right: 0.75rem; }
    .form-control-custom {
      background: transparent;
      border: none;
      width: 100%;
      padding: 0.75rem 0;
      color: var(--text-main);
      font-weight: 500;
    }
    .form-control-custom:focus { outline: none; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.toastr.success('Registration successful! Please login.', 'Success');
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error || 'Registration failed', 'Auth Error');
        this.loading = false;
      }
    });
  }
}
