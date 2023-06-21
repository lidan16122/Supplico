using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SupplicoDAL;
using SupplicoWebAPI.DTO;
using System.Security.Cryptography;

namespace SupplicoWebAPI.Utils
{
    public class TokensManager
    {
        public string Key;
        public int ExpiresInSeconds;
        public string Issuer;
        public string Audience;

        public TokensData GetInitializedTokens(User user)
        {
            return GetInitializedTokens(Key, ExpiresInSeconds, user);
        }

        public TokensData GetInitializedTokens(string key, int expiresInSeconds, User user)
        {
            DateTime accessTokenExpires = DateTime.Now.AddSeconds(expiresInSeconds);
            DateTime refreshTokenExpires = accessTokenExpires.AddSeconds(expiresInSeconds * 10);
            return new TokensData()
            {
                ExpiresInSeconds = expiresInSeconds,
                AccessToken = GetJWTToken(key, accessTokenExpires, user),
                AccessTokenExpires = accessTokenExpires,
                RefreshToken = GetTokenRefreshToken(user, refreshTokenExpires),
                RefreshTokenExpires = refreshTokenExpires
            };
        }

        private string GetTokenRefreshToken(User user, DateTime expires)
        {

            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes((user.UserId + ":" + expires.Ticks).ToString()));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        public string GetJWTToken(User user)
        {
            return GetJWTToken(Key, DateTime.UtcNow.AddSeconds(ExpiresInSeconds), user);
        }

        public string GetJWTToken(string key, DateTime expires, User user)
        {
            var keyBytes = Encoding.ASCII.GetBytes(key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.NameId,user.UserId.ToString()),
                    new Claim(JwtRegisteredClaimNames.Name, user.UserName),
                    new Claim("RoleId",user.RoleId.ToString()),
                }),
                IssuedAt = DateTime.Now,
                Expires = expires,
                Issuer = Issuer,
                Audience = Audience,
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(keyBytes),
                SecurityAlgorithms.HmacSha512Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            return tokenHandler.WriteToken(token);
        }

        public User GetUser(string jwtToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var convertedJWTToken = tokenHandler.ReadJwtToken(jwtToken);
            var userId = convertedJWTToken.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.NameId).Value;
            var userName = convertedJWTToken.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Name).Value;
            var roleID = convertedJWTToken.Claims.First(claim => claim.Type == "RoleId").Value;
            var user = new User()
            {
                UserId = int.Parse(userId),
                UserName = userName,
                RoleId = int.Parse(roleID)
            };
            return user;
        }
    }
}
