

//using API.Middleware;
//using Application.Interfaces;
//using Application.Services;
//using Application.Validators;
//using Day7.Application.Interfaces;
//using Day7.Application.Services;
//using Day7.Infrastructure.Security;
//using FluentValidation;
//using FluentValidation.AspNetCore;
//using Infrastructure.Repositories;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using Serilog;
//using System.Text;
//var builder = WebApplication.CreateBuilder(args);

//// ✅ Serilog Logging
//Log.Logger = new LoggerConfiguration()
//    .WriteTo.Console()
//    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day)
//    .CreateLogger();

//builder.Host.UseSerilog();

//// ✅ Controllers
//builder.Services.AddControllers();

//// ✅ Swagger
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//// ✅ CORS (for Angular + Swagger)
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll",
//        policy => policy.AllowAnyOrigin()
//                        .AllowAnyMethod()
//                        .AllowAnyHeader());
//});

//// ✅ JWT CONFIG
//var jwtKey = builder.Configuration["Jwt:Key"] ?? "SUPER_SECRET_KEY_12345678901234567890";
//var key = Encoding.UTF8.GetBytes(jwtKey);


//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false;
//    options.SaveToken = true;

//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(key),

//        ValidateIssuer = true,
//        ValidIssuer = "Day7",

//        ValidateAudience = true,
//        ValidAudience = "Day7",

//        ClockSkew = TimeSpan.FromMinutes(5) // ✅ ADDED THIS for stability
//    };
//});


//builder.Services.AddAuthorization();

//// ✅ FluentValidation
//builder.Services.AddFluentValidationAutoValidation();
//builder.Services.AddValidatorsFromAssemblyContaining<EmployeeValidator>();

//// ✅ Dependency Injection
//builder.Services.AddScoped<EmployeeRepository>();
//builder.Services.AddScoped<IEmployeeService, EmployeeService>();

//builder.Services.AddScoped<UserRepository>();
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IJwtService, JwtService>();

//var app = builder.Build();

//// ✅ Middleware Order (CRITICAL)
//app.UseSwagger();
//app.UseSwaggerUI();

//app.UseRouting();

//app.UseCors("AllowAll");

//app.UseAuthentication();
//app.UseAuthorization();

//// Global Error Handler
//app.UseMiddleware<ErrorMiddleware>();

//app.MapControllers();

//app.Run();





using API.Middleware;
using Application.Interfaces;
using Application.Services;
using Application.Validators;
using Day7.Application.Interfaces;
using Day7.Application.Services;
using Day7.Infrastructure.Security;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ Serilog Logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ✅ Controllers
builder.Services.AddControllers();

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ CORS (Angular + Swagger)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});


// ================= JWT CONFIG =================

var jwtKey = builder.Configuration["Jwt:Key"] ?? "SUPER_SECRET_KEY_12345678901234567890";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "Day7";
var audience = builder.Configuration["Jwt:Audience"] ?? "Day7";

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateIssuer = true,
        ValidIssuer = issuer,

        ValidateAudience = true,
        ValidAudience = audience,

        ValidateLifetime = true, // ✅ VERY IMPORTANT (token expiry check)

        ClockSkew = TimeSpan.Zero // ✅ strict expiry (best practice)
    };

    // 🔥 OPTIONAL: Better error debugging
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Token Failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token Validated Successfully");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();


// ================= VALIDATION =================

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<EmployeeValidator>();


// ================= DEPENDENCY INJECTION =================

builder.Services.AddScoped<EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();


var app = builder.Build();


// ================= MIDDLEWARE ORDER =================

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseCors("AllowAll");

// 🔐 MUST ORDER
app.UseAuthentication();
app.UseAuthorization();

// Global Error Handler
app.UseMiddleware<ErrorMiddleware>();

app.MapControllers();

app.Run();