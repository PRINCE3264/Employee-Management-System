//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;
//using Microsoft.IdentityModel.Tokens;

//namespace Infrastructure.Security
//{
//    public class JwtService
//    {
//        private readonly string _key = "SUPER_SECRET_KEY_12345";

//        public string GenerateToken(string email, string role)
//        {
//            var claims = new[]
//            {
//                new Claim(ClaimTypes.Email, email),
//                new Claim(ClaimTypes.Role, role)
//            };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                claims: claims,
//                expires: DateTime.Now.AddHours(2),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}

using Day7.Application.Interfaces; // ✅ IMPORTANT
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

using Microsoft.Extensions.Configuration; // ✅ ADD THIS

namespace Day7.Infrastructure.Security
{
    public class JwtService : IJwtService // ✅ FIX HERE
    {
        private readonly IConfiguration _config;
        private readonly string _key;

        public JwtService(IConfiguration config)
        {
            _config = config;
            _key = _config["Jwt:Key"] ?? "SUPER_SECRET_KEY_12345678901234567890";
        }


        public string GenerateToken(string email, string role)
        {
            var claims = new[]
            {
                new Claim("email", email),
                new Claim("role", role),
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "Day7",
                audience: "Day7",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateToken(string email)
        {
            throw new NotImplementedException();
        }
    }
}