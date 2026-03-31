

using Day7.Application.DTO;
using Day7.Domain.Entities;


namespace Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int id);
        Task AddAsync(EmployeeDto dto);
        Task UpdateAsync(int id, EmployeeDto dto);
        Task DeleteAsync(int id);
    }
}