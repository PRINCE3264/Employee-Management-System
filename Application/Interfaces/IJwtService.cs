using Day7.Application.DTO;

namespace Day7.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(string email);
        string GenerateToken(string email, string role);
    }
}
