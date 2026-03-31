
using Application.Interfaces;
using Day7.Application.DTO.Application.DTOs;

using Day7.Application.Helpers;
using Day7.Application.Helpers.Application.Helpers;
using Day7.Application.Interfaces;
using Day7.Domain.Entities;
using Day7.Domain.Entities.Domain.Entities;

using Infrastructure.Repositories;

namespace Day7.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserRepository _repo;
        private readonly IJwtService _jwt; // ✅ FIX

        public AuthService(UserRepository repo, IJwtService jwt)
        {
            _repo = repo;
            _jwt = jwt;
        }

        public async Task Register(RegisterDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = PasswordHelper.Hash(dto.Password),
                Role = "User"
            };

            await _repo.AddUser(user);
        }

        public async Task<AuthResponseDto> Login(LoginDto dto)
        {
            var user = await _repo.GetByEmail(dto.Email);

            if (user == null || user.PasswordHash != PasswordHelper.Hash(dto.Password))
                throw new Exception("Invalid credentials");

            var token = _jwt.GenerateToken(user.Email, user.Role);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}