using SupplicoDAL;

namespace SupplicoWebAPI.DTO
{
    public class ProductWithImage : Product
    {
            public IFormFile? Image { get; set; }
        
    }
}
