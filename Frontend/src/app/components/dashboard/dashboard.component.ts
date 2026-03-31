import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="container py-4 animate-fade-in">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div class="d-flex align-items-center">
          <div class="brand-icon bg-primary text-white rounded-4 me-3 d-flex align-items-center justify-content-center shadow-lg" style="width: 64px; height: 64px;">
             <i class="bi bi-grid-fill fs-2"></i>
          </div>
          <div>
            <h1 class="fw-bold text-main mb-1">Employee<span class="text-primary">Management</span>System</h1>
            <p class="text-muted mb-0">Welcome back! Here's what's happening with your workforce today.</p>
          </div>
        </div>
        <button (click)="loadData()" class="btn btn-primary d-flex align-items-center justify-content-center shadow-sm" [disabled]="loading()">
          <i class="bi bi-arrow-clockwise me-2" [class.spinner-border]="loading()" [class.spinner-border-sm]="loading()"></i>
          {{ loading() ? 'Updating...' : 'Refresh Data' }}
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="d-flex flex-column align-items-center py-5">
        <div class="spinner-grow text-primary" role="status"></div>
        <div class="mt-3 text-muted fw-medium">Syncing database...</div>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!loading()" class="animate-slide-up">
        <!-- Stats Cards -->
        <div class="row g-4 mb-5">
          <div class="col-12 col-sm-6 col-xl-3" *ngFor="let stat of mainStats()">
            <div class="card border-0 shadow-sm h-100 overflow-hidden">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="rounded-3 p-3" [ngClass]="'bg-' + stat.color + '-soft'">
                    <i class="bi fs-4" [class]="stat.icon" [ngClass]="'text-' + stat.color"></i>
                  </div>
                  <span class="badge bg-light text-muted rounded-pill">Real-time</span>
                </div>
                <div class="text-muted small fw-medium mb-1">{{ stat.label }}</div>
                <div class="fs-3 fw-bold text-main">{{ stat.value }}</div>
              </div>
              <div class="progress rounded-0" style="height: 4px;">
                <div class="progress-bar" [ngClass]="'bg-' + stat.color" role="progressbar" style="width: 70%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="row g-4">
          <div class="col-12 col-lg-8">
            <div class="card border-0 shadow-sm p-4 h-100">
               <div class="d-flex align-items-center mb-4">
                 <h5 class="mb-0">Department Distribution</h5>
                 <i class="bi bi-info-circle ms-2 text-muted small" title="Number of employees per department"></i>
               </div>
              <div style="display: block; height: 320px;">
                <canvas baseChart
                  [data]="barChartData()"
                  [options]="barChartOptions"
                  [type]="barChartType">
                </canvas>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="card border-0 shadow-sm p-4 h-100">
              <div class="d-flex align-items-center mb-4">
                <h5 class="mb-0">Budget Allocation</h5>
                <i class="bi bi-info-circle ms-2 text-muted small" title="Total salary budget by department"></i>
              </div>
              <div style="display: block; height: 320px;">
                <canvas baseChart
                  [data]="pieChartData()"
                  [options]="pieChartOptions"
                  [type]="pieChartType">
                </canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .bg-primary-soft { background-color: rgba(99, 102, 241, 0.1); }
    .bg-success-soft { background-color: rgba(16, 185, 129, 0.1); }
    .bg-info-soft { background-color: rgba(14, 165, 233, 0.1); }
    .bg-warning-soft { background-color: rgba(245, 158, 11, 0.1); }
    
    .text-primary { color: #6366f1 !important; }
    .text-success { color: #10b981 !important; }
    .text-info { color: #0ea5e9 !important; }
    .text-warning { color: #f59e0b !important; }
    
    .card { transition: all 0.3s ease; border: 1px solid var(--border-light) !important; }
    .card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg) !important; }
    .progress-bar { opacity: 0.6; }
  `]
})
export class DashboardComponent implements OnInit {
  employees = signal<Employee[]>([]);
  loading = signal<boolean>(true);

  // Computed properties for auto-reactivity
  totalPayroll = computed(() => this.employees().reduce((sum, e) => sum + (e.salary || 0), 0));
  avgSalary = computed(() => this.employees().length ? this.totalPayroll() / this.employees().length : 0);
  
  departmentStats = computed(() => {
    const data = this.employees();
    if (!data.length) return [];
    
    const depts = Array.from(new Set(data.map(e => e.department)));
    return depts.map(d => ({
      name: d,
      count: data.filter(e => e.department === d).length,
      budget: data.filter(e => e.department === d).reduce((sum, e) => sum + (e.salary || 0), 0)
    }));
  });

  mainStats = computed(() => [
    { label: 'Total Employees', value: this.employees().length, icon: 'bi-people', color: 'primary' },
    { label: 'Total Payroll', value: '₹' + (this.totalPayroll() || 0).toLocaleString(), icon: 'bi-cash-stack', color: 'success' },
    { label: 'Departments', value: this.departmentStats().length, icon: 'bi-building', color: 'info' },
    { label: 'Avg Salary', value: '₹' + (this.avgSalary() || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }), icon: 'bi-graph-up-arrow', color: 'warning' }
  ]);

  // Chart Properties
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };
  public barChartType: ChartType = 'bar';
  
  barChartData = computed<ChartData<'bar'>>(() => {
    const stats = this.departmentStats();
    return {
      labels: stats.map(s => s.name),
      datasets: [{
        data: stats.map(s => s.count),
        backgroundColor: ['#0d6efd', '#198754', '#0dcaf0', '#ffc107', '#dc3545', '#6610f2'],
        borderRadius: 8
      }]
    };
  });

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  public pieChartType: ChartType = 'pie';

  pieChartData = computed<ChartData<'pie'>>(() => {
    const stats = this.departmentStats();
    return {
      labels: stats.map(s => s.name),
      datasets: [{
        data: stats.map(s => s.budget),
        backgroundColor: ['#0d6efd', '#198754', '#0dcaf0', '#ffc107', '#dc3545', '#6610f2']
      }]
    };
  });

  constructor(private service: EmployeeService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
