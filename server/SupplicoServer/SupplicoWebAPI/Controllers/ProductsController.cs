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
        [HttpGet("{userID:int}")]
        public ActionResult<IEnumerable<Product>> GetSupplierProducts(int userID)
        {
            if (_SupplicoContext.Products.Where(p => p.UserId == userID).Count() == 0) return NotFound("Supplier Has No Products");
            else
            {
                var products = _SupplicoContext.Products
                        .Where(p => p.UserId == userID)
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
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (!ModelState.IsValid) return BadRequest("request data is invalid");
            else
            {
                _SupplicoContext.Products.Add(product);
                await _SupplicoContext.SaveChangesAsync();
                return Created($"/orders/{product.Id}", product);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var product = await _SupplicoContext.Products.FindAsync(id);
            if (product == null) return NotFound("The specific product you are looking for is not found");
            else
            {
                _SupplicoContext.Products.Remove(product);
                await _SupplicoContext.SaveChangesAsync();
                return NoContent();
            }
        }
    }
}
