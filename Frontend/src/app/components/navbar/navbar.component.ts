import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg glass sticky-top px-0 py-3">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <div class="brand-icon bg-primary text-white rounded-3 me-2 d-flex align-items-center justify-content-center shadow-sm">
            <i class="bi bi-person-badge-fill fs-5"></i>
          </div>
          <span class="fs-5 text-main">EM<span class="text-primary">S</span></span>
        </a>
        
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li class="nav-item">
              <a class="nav-link px-3" routerLinkActive="active" routerLink="/dashboard">
                <i class="bi bi-grid-1x2-fill me-1"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" routerLinkActive="active" routerLink="/employees">
                <i class="bi bi-people-fill me-1"></i> Employees
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2">
             <button (click)="theme.toggleTheme()" class="btn btn-icon" [title]="theme.isDarkMode() ? 'Light Mode' : 'Dark Mode'">
                <i class="bi fs-5" [ngClass]="theme.isDarkMode() ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'"></i>
             </button>
             
             <div *ngIf="auth.isLoggedIn()" class="dropdown">
                <button class="btn btn-user d-flex align-items-center dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <div class="avatar-sm bg-primary-soft text-primary rounded-circle me-2">
                    {{ auth.currentUser()?.email?.charAt(0)?.toUpperCase() }}
                  </div>
                  <span class="fw-medium d-none d-sm-inline">{{ auth.currentUser()?.email }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end p-2 border-0 shadow-lg mt-3">
                  <li class="px-3 py-2 border-bottom mb-2">
                    <div class="small text-muted">Signed in as</div>
                    <div class="fw-bold text-truncate" style="max-width: 150px;">{{ auth.currentUser()?.email }}</div>
                  </li>
                  <li><a class="dropdown-item rounded-2" routerLink="/profile"><i class="bi bi-person me-2"></i> Profile</a></li>
                  <li><button (click)="logout()" class="dropdown-item rounded-2 text-danger"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</button></li>
                </ul>
             </div>

             <a *ngIf="!auth.isLoggedIn()" routerLink="/login" class="btn btn-primary btn-sm px-4 rounded-pill shadow-sm">
                Sign In
             </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      border-bottom: 1px solid var(--glass-border);
      transition: all 0.3s ease;
      z-index: 1050;
    }
    .brand-icon { width: 36px; height: 36px; }
    .nav-link { 
      color: var(--text-muted); 
      font-weight: 500;
      transition: all 0.2s ease;
      border-radius: 8px;
    }
    .nav-link:hover { color: var(--primary); background: var(--primary-soft); }
    .nav-link.active { color: var(--primary); background: var(--primary-soft); }
    
    .btn-icon {
      width: 40px; height: 40px;
      padding: 0;
      display: flex; align-items: center; justify-content: center;
      border-radius: 10px;
      color: var(--text-muted);
    }
    .btn-icon:hover { background: var(--primary-soft); color: var(--primary); }
    
    .btn-user {
      padding: 4px 8px 4px 4px;
      border-radius: 50px;
      background: var(--bg-main);
      border: 1px solid var(--border-light);
    }
    .avatar-sm { 
      width: 32px; height: 32px; 
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; font-weight: 600;
    }
    .dropdown-toggle::after { border-top-color: var(--text-muted); }
    .dropdown-item { padding: 0.6rem 1rem; font-weight: 500; transition: all 0.2s; }
    .dropdown-item:hover { background: var(--primary-soft); color: var(--primary); }
  `]
})
export class NavbarComponent {
  constructor(public theme: ThemeService, public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}

