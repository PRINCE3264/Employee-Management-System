import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: string[] = [];
  selectedDepartment: string = '';
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 5;
  selectedEmployeeIds: Set<number> = new Set();
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private service: EmployeeService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.service.getAll().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        const fromDb = data.map((e: Employee) => e.department).filter((d: string) => d);
        this.departments = Array.from(new Set(fromDb));
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toastr.error('Failed to load employees', 'Error');
        console.error(err);
      }
    });
  }

  applyFilter(): void {
    this.filteredEmployees = this.employees.filter((e: Employee) => {
      const matchesSearch = !this.searchTerm || 
        e.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        e.department.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDept = !this.selectedDepartment || 
        e.department === this.selectedDepartment;
      
      return matchesSearch && matchesDept;
    });
    // Apply Sorting
    if (this.sortColumn) {
      this.filteredEmployees.sort((a: any, b: any) => {
        const valA = a[this.sortColumn];
        const valB = b[this.sortColumn];
        
        let comparison = 0;
        if (valA > valB) comparison = 1;
        if (valA < valB) comparison = -1;
        
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.page = 1; // Reset to first page on search
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.filteredEmployees.forEach((e: Employee) => this.selectedEmployeeIds.add(e.id));
    } else {
      this.selectedEmployeeIds.clear();
    }
  }

  toggleSelect(id: number): void {
    if (this.selectedEmployeeIds.has(id)) {
      this.selectedEmployeeIds.delete(id);
    } else {
      this.selectedEmployeeIds.add(id);
    }
  }

  isAllSelected(): boolean {
    return this.filteredEmployees.length > 0 && 
           this.filteredEmployees.every((e: Employee) => this.selectedEmployeeIds.has(e.id));
  }

  today = new Date();

  exportToExcel() {
    this.exportData(this.getSelectedOnly(), 'xlsx');
  }

  exportToCSV() {
    this.exportData(this.getSelectedOnly(), 'csv');
  }

  exportAllToExcel() {
    this.exportData(this.filteredEmployees, 'xlsx');
  }

  exportAllToCSV() {
    this.exportData(this.filteredEmployees, 'csv');
  }

  private getSelectedOnly(): Employee[] {
    return this.employees.filter((e: Employee) => this.selectedEmployeeIds.has(e.id));
  }

  private exportData(dataToExport: Employee[], format: 'xlsx' | 'csv') {
    if (dataToExport.length === 0) {
      this.toastr.warning('No employees to export');
      return;
    }

    // Format data for professional export
    const formattedData = dataToExport.map((e: Employee) => ({
      ID: e.id,
      Name: e.name,
      Department: e.department,
      Salary: e.salary,
      Joined: new Date(e.joiningDate).toLocaleDateString()
    }));

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'StaffSphere_Export');
      XLSX.writeFile(workbook, `StaffSphere_Employees_${new Date().getTime()}.xlsx`);
    } else {
      const csv = this.convertToCSV(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `StaffSphere_Employees_${new Date().getTime()}.csv`;
      link.click();
    }
    this.toastr.success(`Successfully exported ${dataToExport.length} records.`, 'Export Ready');
  }

  private convertToCSV(data: Employee[]): string {
    const headers = ['ID', 'Name', 'Department', 'Salary', 'Joined Date'];
    const rows = data.map((e: Employee) => [
      e.id, 
      e.name, 
      e.department, 
      e.salary, 
      new Date(e.joiningDate).toLocaleDateString()
    ]);
    return [headers, ...rows].map(r => r.join(',')).join('\n');
  }

  getDetailedSelectedPreview(): string {
    const selected = this.employees.filter((e: Employee) => this.selectedEmployeeIds.has(e.id));
    if (selected.length === 0) return '';
    const details = selected.map((e: Employee) => `#${e.id} ${e.name}`);
    if (details.length <= 2) return details.join(', ');
    return `${details.slice(0, 2).join(', ')} ... and ${details.length - 2} more staff members`;
  }

  deleteEmployee(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => {
            this.handleDeleteSuccess();
          },
          error: (err) => {
            this.toastr.error('Delete failed', 'Error');
          }
        });
      }
    });
  }

  private handleDeleteSuccess(): void {
    Swal.fire(
      'Deleted!',
      'Employee record has been deleted.',
      'success'
    );
    this.loadEmployees();
    this.toastr.success('Employee deleted successfully', 'Success');
  }
}
