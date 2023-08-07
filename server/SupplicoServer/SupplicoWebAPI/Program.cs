using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SupplicoDAL;
using SupplicoWebAPI.Utils;
using Microsoft.EntityFrameworkCore;

namespace SupplicoWebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            string supplicoCS = builder.Configuration.GetConnectionString("Supplico");
            int expiresInSeconds = int.Parse(builder.Configuration.GetSection("Jwt:ExpiresInSeconds").Value);
            string key = builder.Configuration.GetSection("Jwt:Key").Value;
            string issuer = builder.Configuration.GetSection("Jwt:Issuer").Value;
            string audience = builder.Configuration.GetSection("Jwt:Audience").Value;

            builder.Services.AddDbContext<SupplicoContext>(cfg => cfg.UseSqlServer(supplicoCS));
            builder.Services.AddControllers();

            builder.Services.AddCors(sa =>
            {
                sa.AddDefaultPolicy(pol =>
                {
                    pol.AllowAnyHeader();
                    pol.AllowAnyMethod();
                    pol.AllowAnyOrigin();
                });
            });

            builder.Services.AddSingleton<TokensManager>(new TokensManager()
            {
                Issuer = issuer,
                Audience = audience,
                ExpiresInSeconds = expiresInSeconds,
                Key = key
            });

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    ValidateIssuer = true,
                    ValidateAudience = true,

                    IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(key)),
                    ValidateLifetime = true,
                    ClockSkew = System.TimeSpan.Zero,
                    ValidateIssuerSigningKey = true
                };
            });

            var app = builder.Build();

            app.UseCors();

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}