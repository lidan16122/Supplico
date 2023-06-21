namespace SupplicoWebAPI.DTO
{
    public class LoginResponse
    {
        public TokensData TokensData { get; set; }
        public UserResponse UserResponse { get; set; }

        public LoginResponse() { }

        public LoginResponse(TokensData td, UserResponse ur)
        {
            TokensData = td;
            UserResponse = ur;
        }
    }
}
