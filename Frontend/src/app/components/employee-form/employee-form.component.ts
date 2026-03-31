import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeDto } from '../../models/employee.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode: boolean = false;
  employeeId: number | null = null;
  loading: boolean = false;
  departments: string[] = []; // ❌ Hardcoded defaults removed

  constructor(
    private fb: FormBuilder,
    private service: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadExistingDepartments();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.employeeId = +idParam;
      this.loadEmployeeData(this.employeeId);
    }
  }

  loadExistingDepartments(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        // ✅ Get strictly unique departments from the Database
        this.departments = Array.from(new Set(data.map(e => e.department))).filter(d => d);
      }
    });
  }



  createForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      joiningDate: ['', Validators.required]
    });
  }

  loadEmployeeData(id: number): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (data) => {
        // Format date to YYYY-MM-DD for input[type="date"]
        const formattedDate = data.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : '';
        this.employeeForm.patchValue({
          name: data.name,
          department: data.department,
          salary: data.salary,
          joiningDate: formattedDate
        });
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load employee details', 'Error');
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Validation');
      return;
    }

    const dto: EmployeeDto = this.employeeForm.value;
    this.loading = true;

    if (this.isEditMode && this.employeeId) {
      this.service.update(this.employeeId, dto).subscribe({
        next: () => {
          this.handleSuccess('Updated!');
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    } else {
      this.service.add(dto).subscribe({
        next: () => {
          this.handleSuccess('Created!');
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  private handleSuccess(title: string): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: `Employee has been ${this.isEditMode ? 'updated' : 'added'} successfully.`,
      confirmButtonColor: '#0d6efd'
    });
    this.toastr.success(`Employee ${this.isEditMode ? 'updated' : 'added'} successfully`, 'Success');
    this.router.navigate(['/employees']);
  }

  private handleError(err: any): void {
    this.loading = false;
    this.toastr.error('An error occurred during save', 'Error');
    console.error(err);
  }
}
