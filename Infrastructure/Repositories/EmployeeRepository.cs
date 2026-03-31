using Day7.Domain.Entities;

using Npgsql;

namespace Infrastructure.Repositories
{
    public class EmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        // ✅ GET ALL
        public async Task<List<Employee>> GetAllAsync()
        {
            var list = new List<Employee>();

            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand("SELECT * FROM Employee ORDER BY Id", conn);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new Employee
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Department = reader.GetString(2),
                    Salary = reader.GetDecimal(3),
                    JoiningDate = reader.GetDateTime(4)
                });
            }

            return list;
        }

        // ✅ GET BY ID
        public async Task<Employee?> GetByIdAsync(int id)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand("SELECT * FROM Employee WHERE Id = @id", conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new Employee
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Department = reader.GetString(2),
                    Salary = reader.GetDecimal(3),
                    JoiningDate = reader.GetDateTime(4)
                };
            }

            return null;
        }

        // ✅ INSERT
        public async Task AddAsync(Employee emp)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand(@"
                INSERT INTO Employee (Name, Department, Salary, JoiningDate)
                VALUES (@name, @dept, @salary, @date)", conn);

            cmd.Parameters.AddWithValue("@name", emp.Name);
            cmd.Parameters.AddWithValue("@dept", emp.Department);
            cmd.Parameters.AddWithValue("@salary", emp.Salary);
            cmd.Parameters.AddWithValue("@date", emp.JoiningDate);

            await cmd.ExecuteNonQueryAsync();
        }

        // ✅ UPDATE
        public async Task UpdateAsync(Employee emp)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand(@"
                UPDATE Employee 
                SET Name=@name, Department=@dept, Salary=@salary, JoiningDate=@date
                WHERE Id=@id", conn);

            cmd.Parameters.AddWithValue("@id", emp.Id);
            cmd.Parameters.AddWithValue("@name", emp.Name);
            cmd.Parameters.AddWithValue("@dept", emp.Department);
            cmd.Parameters.AddWithValue("@salary", emp.Salary);
            cmd.Parameters.AddWithValue("@date", emp.JoiningDate);

            await cmd.ExecuteNonQueryAsync();
        }

        // ✅ DELETE
        public async Task DeleteAsync(int id)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand("DELETE FROM Employee WHERE Id=@id", conn);
            cmd.Parameters.AddWithValue("@id", id);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}