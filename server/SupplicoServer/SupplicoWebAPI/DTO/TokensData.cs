namespace SupplicoWebAPI.DTO
{
    public class TokensData
    {
        public string? AccessToken { get; set; }
        public DateTime? AccessTokenExpires { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpires { get; set; }
        public int? ExpiresInSeconds { get; set; }
    }
}
