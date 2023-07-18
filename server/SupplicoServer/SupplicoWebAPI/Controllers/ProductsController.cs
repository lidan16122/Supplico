using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;
using SupplicoWebAPI.Utils;

namespace SupplicoWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        SupplicoContext _SupplicoContext;

        public ProductsController(SupplicoContext supplicoContext)
        {
            _SupplicoContext = supplicoContext;
        }


        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            if (_SupplicoContext.Products == null) return NotFound("No products in database");
            else
            {
                var products = _SupplicoContext.Products
                        .Include(p => p.User)
                        .Select(p => new
                        {
                            Id = p.Id,
                            Name = p.Name,
                            Price = p.Price,
                            UserId = p.UserId,
                            UserFullName = p.User.FullName
                        }).ToList();
                return Ok(products);
            }
        }
        [HttpGet("supplier/{userID:int}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetSupplierProducts(int userID) 
        {
            //if (_SupplicoContext.Users.FirstOrDefault(u => u.UserId == userID) == null) return NotFound("Supplier No Found");
             if (_SupplicoContext.Products.Where(p => p.UserId == userID).Count() == 0) return NotFound("Supplier Has No Products");
            else return await _SupplicoContext.Products.Where(p => p.UserId == userID).ToListAsync();
        }
    }
}
