using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;
using SupplicoWebAPI.DTO;
using SupplicoWebAPI.Utils;

namespace SupplicoWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly SupplicoContext _SupplicoContext;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(SupplicoContext supplicoContext, ILogger<ProductsController> logger)
        {
            _SupplicoContext = supplicoContext;
            _logger = logger;
        }


        [HttpGet]
        [Authorize]
        public IActionResult GetProducts()
        {
            _logger.LogInformation("GetProducts method initiated");
            if (_SupplicoContext.Products == null)  
            {
                _logger.LogWarning("GetProducts: no products in database, returning 404 statuscode");
                return NotFound("No products in database");
            }
            else
            {
                try
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
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetProducts method completed");
                }

            }
        }
        [HttpGet("{userID:int}")]
        public IActionResult GetSupplierProducts(int userID)
        {
            _logger.LogInformation("GetSupplierProducts method initiated");
            if (_SupplicoContext.Products.Where(p => p.UserId == userID).Count() == 0)
            {
                _logger.LogWarning("GetSupplierProducts: this supplier has no products in database, returning 404 statuscode");
                return NotFound("Supplier has no products");
            }
            else
            {
                try
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
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetSupplierProducts method completed");
                }
            }
        }
        [HttpGet("edit/{productID:int}")]
        public async Task<ActionResult<Product>> GetSpecificProduct(int productID)
        {
            _logger.LogInformation("GetSpecificProduct method initiated");
            if (_SupplicoContext.Products == null)
            {
                _logger.LogWarning("GetSpecificProduct: no products in database, returning 404 statuscode");
                return NotFound("No products available");
            }
            try
            {
                var product = await _SupplicoContext.Products.FindAsync(productID);
                if (product == null)
                {
                    _logger.LogWarning("GetSpecificProduct: cannot find product in database, returning 404 statuscode");
                    return NotFound("Didn't found any product");
                }
                else
                    return product;
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return StatusCode(500);
            }
            finally
            {
                _logger.LogInformation("GetSpecificProduct method completed");
            }
        }
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _logger.LogInformation("PostProduct method initiated");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("PostProduct: invalid product data input, returning 400 statuscode");
                return BadRequest("request data is invalid");
            }
            else
            {
                try
                {
                    _SupplicoContext.Products.Add(product);
                    await _SupplicoContext.SaveChangesAsync();
                    return Created($"/orders/{product.Id}", product);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("PostProduct method completed");
                }
            }
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateProduct(Product product)
        {
            _logger.LogInformation("UpdateProduct method initiated");
            var productInDb = _SupplicoContext.Products.FirstOrDefaultAsync(p => p.Id == product.Id).Result;
            if (productInDb == null)
            {
                _logger.LogWarning("UpdateProduct: cannot find product in database, returning 404 statuscode");
                return NotFound("Product didn't found");
            }
            else
            {
                try
                {
                    productInDb.Name = product.Name;
                    productInDb.Price = product.Price;
                    await _SupplicoContext.SaveChangesAsync();
                    return NoContent();
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("UpdateProduct method completed");
                }
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            _logger.LogInformation("DeleteProduct method initiated");
            var product = await _SupplicoContext.Products.FindAsync(id);
            if (product == null)
            {
                _logger.LogWarning("DeleteProduct: cannot find product in database, returning 404 statuscode");
                return NotFound("The specific product you are looking for is not found");
            }
            else
            {
                try
                {
                    _SupplicoContext.Products.Remove(product);
                    await _SupplicoContext.SaveChangesAsync();
                    return NoContent();

                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("DeleteProduct method completed");
                }
            }
        }
    }
}
