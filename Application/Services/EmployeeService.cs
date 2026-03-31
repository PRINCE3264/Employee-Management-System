

using Application.Interfaces;
using Day7.Application.DTO;
using Day7.Domain.Entities;
using Infrastructure.Repositories;

namespace Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeRepository _repo;

        public EmployeeService(EmployeeRepository repo)
        {
            _repo = repo;
        }

        // ✅ GET ALL
        public async Task<List<Employee>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        // ✅ GET BY ID
        public async Task<Employee?> GetByIdAsync(int id)
        {
            var employees = await _repo.GetAllAsync();
            return employees.FirstOrDefault(e => e.Id == id);
        }

        // ✅ ADD
        public async Task AddAsync(EmployeeDto dto)
        {
            var emp = new Employee
            {
                Name = dto.Name,
                Department = dto.Department,
                Salary = dto.Salary,
                JoiningDate = dto.JoiningDate
            };

            await _repo.AddAsync(emp);
        }

        // ✅ UPDATE
        public async Task UpdateAsync(int id, EmployeeDto dto)
        {
            var existing = await GetByIdAsync(id);

            if (existing == null)
                throw new Exception("Employee not found");

            existing.Name = dto.Name;
            existing.Department = dto.Department;
            existing.Salary = dto.Salary;
            existing.JoiningDate = dto.JoiningDate;

            await _repo.UpdateAsync(existing);
        }

        // ✅ DELETE
        public async Task DeleteAsync(int id)
        {
            var existing = await GetByIdAsync(id);

            if (existing == null)
                throw new Exception("Employee not found");

            await _repo.DeleteAsync(id);
        }
    }
}