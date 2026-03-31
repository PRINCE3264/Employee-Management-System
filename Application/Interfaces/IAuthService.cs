
using Day7.Application.DTO.Application.DTOs;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task Register(RegisterDto dto);
        Task<AuthResponseDto> Login(LoginDto dto);
    }
}