using SupplicoDAL;

namespace SupplicoWebAPI.DTO
{
    public class UserWithImage : User
    {
            public IFormFile? Image { get; set; }
        
    }
}
