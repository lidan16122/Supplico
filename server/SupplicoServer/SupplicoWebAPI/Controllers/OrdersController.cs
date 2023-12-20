using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;

namespace SupplicoWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly SupplicoContext _SupplicoContext;
        private readonly ILogger<OrdersController> _logger;
        public OrdersController(SupplicoContext supplicoContext, ILogger<OrdersController> logger)
        {
            _SupplicoContext = supplicoContext;
            _logger = logger;
        }
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            _logger.LogInformation("GetOrders method initiated");
            if (_SupplicoContext.Orders == null)
            {
                _logger.LogWarning("GetOrders: no orders in database, returning 404 statuscode");
                return NotFound("No orders in database");
            }
            else
            {
                try
                {
                    return await _SupplicoContext.Orders.ToListAsync();
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetOrders method completed");
                }
            }
        }
        [HttpGet("{userID:int}")]
        [Authorize]
        public IActionResult GetUserOrders(int userID)
        {
            _logger.LogInformation("GetUserOrders method initiated");
            if (_SupplicoContext.Orders == null)
            {
                _logger.LogWarning("GetUserOrders: no orders in database, returning 404 statuscode");
                return NotFound("No orders in database");
            }
            else if (_SupplicoContext.Orders.Where(o => o.BusinessId == userID || o.DriverId == userID || o.SupplierId == userID).Count() < 0)
            {
                _logger.LogWarning("GetUserOrders: this user has no orders in database, returning 404 statuscode");
                return NotFound("User has no orders");
            }
            else
            {
                try
                {
                    var orders = _SupplicoContext.Orders
                        .Where(o => o.BusinessId == userID || o.DriverId == userID || o.SupplierId == userID)
                        .Include(o => o.Driver)
                        .Include(o => o.Business)
                        .Include(o => o.Supplier)
                        .Select(o => new
                        {
                            OrderId = o.OrderId,
                            TransactionId = o.TransactionId,
                            Sum = o.Sum,
                            Quantity = o.Quantity,
                            Pallets = o.Pallets,
                            SupplierConfirmation = o.SupplierConfirmation,
                            DriverConfirmation = o.DriverConfirmation,
                            BusinessConfirmation = o.BusinessConfirmation,
                            DriverFullName = o.Driver.FullName,
                            SupplierFullName = o.Supplier.FullName,
                            BusinessFullName = o.Business.FullName,
                            Created = o.Created,
                        })
                        .ToList();
                    return Ok(orders);

                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetUserOrders method completed");
                }
            }
        }
        [HttpGet("drivers")]
        public IActionResult OrdersDriverSearch()
        {
            _logger.LogInformation("OrdersDriverSearch method initiated");
            if (_SupplicoContext.Orders == null)
            {
                _logger.LogWarning("OrdersDriverSearch: no orders in database, returning 404 statuscode");
                return NotFound("No orders in database");
            }
            else if (_SupplicoContext.Orders.Where(o => o.DriverId == null).Count() < 0)
            {
                _logger.LogWarning("OrdersDriverSearch: no orders that are missing driver in database, returning 404 statuscode");
                return NotFound("No jobs availabe right now");
            }
            else
            {
                try
                {
                    var orders = _SupplicoContext.Orders
                        .Where(o => o.DriverId == null && o.SupplierConfirmation == true).Include(o => o.Business).Include(o => o.Supplier)
                        .Include(o => o.Driver)
                        .Include(o => o.Business)
                        .Include(o => o.Supplier)
                        .Select(o => new
                        {
                            OrderId = o.OrderId,
                            Sum = o.Sum,
                            Quantity = o.Quantity,
                            Pallets = o.Pallets,
                            SupplierFullName = o.Supplier.FullName,
                            BusinessFullName = o.Business.FullName,
                            Created = o.Created,
                        })
                        .ToList();
                    return Ok(orders);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("OrdersDriverSearch method completed");
                }
            }
        }
        [HttpGet("display-order/{orderID:int}")]
        [Authorize]
        public IActionResult DisplayOrder(int orderID)
        {
            _logger.LogInformation("DisplayOrder method initiated");
            if (_SupplicoContext.Orders.FirstOrDefault(o => o.OrderId == orderID) == null)
            {
                _logger.LogWarning("DisplayOrder: the specific order is not found in database, returning 404 statuscode");
                return NotFound("Order not found");
            }
            else
            {
                try
                {
                    var order = _SupplicoContext.Orders.Where(o => o.OrderId == orderID)
                        .Include(o => o.Driver)
                        .Include(o => o.Business)
                        .Include(o => o.Supplier)
                        .Select(o => new
                        {
                            OrderId = o.OrderId,
                            TransactionId = o.TransactionId,
                            Sum = o.Sum,
                            Quantity = o.Quantity,
                            Pallets = o.Pallets,
                            SupplierConfirmation = o.SupplierConfirmation,
                            DriverConfirmation = o.DriverConfirmation,
                            BusinessConfirmation = o.BusinessConfirmation,
                            DriverFullName = o.Driver.FullName,
                            DriverPhoneNumber = o.Driver.PhoneNumber,
                            DriverEmail = o.Driver.Email,
                            SupplierFullName = o.Supplier.FullName,
                            SupplierPhoneNumber = o.Supplier.PhoneNumber,
                            SupplierEmail = o.Supplier.Email,
                            BusinessFullName = o.Business.FullName,
                            BusinessPhoneNumber = o.Business.PhoneNumber,
                            BusinessEmail = o.Business.Email,

                            Created = o.Created,
                        });
                    return Ok(order);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("DisplayOrder method completed");
                }
            }
        }
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            _logger.LogInformation("PostOrder method initiated");
            object locker = new object();
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("PostOrder: invalid order data input, returning 400 statuscode");
                return BadRequest("request data is invalid");
            }
            else if (order == null)
            {
                _logger.LogWarning("PostOrder: order data is NULL , returning 400 statuscode");
                return BadRequest("order is null");
            }
            else
            {
                lock (locker)
                {
                    order.TransactionId = Guid.NewGuid().ToString();
                    order.Created = DateTime.Now;
                    _SupplicoContext.Orders.Add(order);
                }
                try
                {
                    await _SupplicoContext.SaveChangesAsync();
                    return Created($"/orders/{order.OrderId}", order);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("PostOrder method completed");
                }
            }
        }
        [HttpPut("confirmation")]
        public async Task<IActionResult> UpdateConfirmation(Order order)
        {
            _logger.LogInformation("UpdateConfirmation method initiated");
            var orderInDb = _SupplicoContext.Orders.FirstOrDefaultAsync(o => o.OrderId == order.OrderId).Result;
            if (orderInDb == null)
            {
                _logger.LogWarning("UpdateConfirmation: the specific order is not found in database, returning 404 statuscode");
                return NotFound("The specific order you are looking for is not found");
            }
            else
            {
                if (order.BusinessId != null)
                {
                    orderInDb.BusinessConfirmation = true;
                }
                else if (order.DriverId != null)
                {
                    orderInDb.DriverId = order.DriverId;
                    orderInDb.DriverConfirmation = true;
                }
                else
                {
                    orderInDb.SupplierConfirmation = true;
                }
                try
                {
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
                    _logger.LogInformation("UpdateConfirmation method completed");
                }
            }
        }
        [HttpPut("pallets")]
        public async Task<IActionResult> UpdatePallets(Order order)
        {
            _logger.LogInformation("UpdatePallets method initiated");
            var orderInDb = _SupplicoContext.Orders.FirstOrDefaultAsync(o => o.OrderId == order.OrderId).Result;
            if (orderInDb == null)
            {
                _logger.LogWarning("UpdatePallets: the specific order is not found in database, returning 404 statuscode");
                return NotFound("The specific order you are looking for is not found");
            }
            else
            {
                try
                {
                    orderInDb.Pallets = order.Pallets;
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
                    _logger.LogInformation("UpdatePallets method completed");
                }
            }
        }
    }
}
