
using Day7.Domain.Entities.Domain.Entities;

using Npgsql;

namespace Infrastructure.Repositories
{
    public class UserRepository
    {
        private readonly string _conn;

        public UserRepository(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection");
        }

        public async Task AddUser(User user)
        {
            using var conn = new NpgsqlConnection(_conn);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand(@"
                INSERT INTO Users (Name, Email, PasswordHash, Role)
                VALUES (@name,@email,@pass,@role)", conn);

            cmd.Parameters.AddWithValue("@name", user.Name);
            cmd.Parameters.AddWithValue("@email", user.Email);
            cmd.Parameters.AddWithValue("@pass", user.PasswordHash);
            cmd.Parameters.AddWithValue("@role", user.Role);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<User?> GetByEmail(string email)
        {
            using var conn = new NpgsqlConnection(_conn);
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand("SELECT * FROM Users WHERE Email=@email", conn);
            cmd.Parameters.AddWithValue("@email", email);

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    PasswordHash = reader.GetString(3),
                    Role = reader.GetString(4)
                };
            }

            return null;
        }
    }
}