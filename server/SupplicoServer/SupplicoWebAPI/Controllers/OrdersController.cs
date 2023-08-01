using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;
using SupplicoWebAPI.DTO;

namespace SupplicoWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        SupplicoContext _SupplicoContext;
        public OrdersController(SupplicoContext supplicoContext)
        {
            _SupplicoContext = supplicoContext;
        }
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            if (_SupplicoContext.Orders == null) return NotFound("No orders in database");
            else return await _SupplicoContext.Orders.ToListAsync();
        }
        [HttpGet("{userID:int}")]
        [Authorize]
        public IActionResult GetUserOrders(int userID)
        {
            if (_SupplicoContext.Orders == null) return NotFound("No orders in database");
            else if (_SupplicoContext.Orders.Where(o => o.BusinessId == userID || o.DriverId == userID || o.SupplierId == userID).Count() < 0) return NotFound("User has no orders");
            else
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
        }
        [HttpGet("drivers")]
        public IActionResult OrdersDriverSearch()
        {
            if (_SupplicoContext.Orders == null) return NotFound("No orders in database");
            else if (_SupplicoContext.Orders.Where(o => o.DriverId == null).Count() < 0) return NotFound("No jobs availabe right now");
            else
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
        }
        [HttpGet("display-order/{orderID:int}")]
        [Authorize]
        public IActionResult DisplayOrder(int orderID)
        {
            if (_SupplicoContext.Orders.FirstOrDefault(o => o.OrderId == orderID) == null) return NotFound("Order not found");
            else
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
        }
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            object locker = new object();
            if (!ModelState.IsValid) return BadRequest("request data is invalid");
            else if (order == null) return BadRequest("order is null");
            else
            {
                lock (locker)
                {
                    order.TransactionId = Guid.NewGuid().ToString();
                    order.Created = DateTime.Now;
                    _SupplicoContext.Orders.Add(order);
                }
                    await _SupplicoContext.SaveChangesAsync();
                    return Created($"/orders/{order.OrderId}", order);
            }
        }
        [HttpPut("supplier")]
        public async Task<IActionResult> SupplierConfirm(Order order)
        {
            var orderInDb = _SupplicoContext.Orders.FirstOrDefaultAsync(o => o.OrderId == order.OrderId).Result;
            if (orderInDb == null) return NotFound("The specific order you are looking for is not found");
            else
            {
                orderInDb.SupplierConfirmation = true;
                await _SupplicoContext.SaveChangesAsync();
                return NoContent();
            }
        }
        [HttpPut("driver")]
        public async Task<IActionResult> DriverConfirm(Order order)
        {
            var orderInDb = _SupplicoContext.Orders.FirstOrDefaultAsync(o => o.OrderId == order.OrderId).Result;
            if (orderInDb == null) return NotFound("The specific order you are looking for is not found");
            else
            {
                orderInDb.DriverId = order.DriverId;
                orderInDb.DriverConfirmation = true;
                await _SupplicoContext.SaveChangesAsync();
                return NoContent();
            }
        }
        [HttpPut("business")]
        public async Task<IActionResult> BusinessConfirm(Order order)
        {
            var orderInDb = _SupplicoContext.Orders.FirstOrDefaultAsync(o => o.OrderId == order.OrderId).Result;
            if (orderInDb == null) return NotFound("The specific order you are looking for is not found");
            else
            {
                orderInDb.BusinessId = order.BusinessId;
                orderInDb.BusinessConfirmation = true;
                await _SupplicoContext.SaveChangesAsync();
                return NoContent();
            }
        }
        [HttpPut("pallets")]
        public async Task<IActionResult> UpdatePallets(Order order)
        {
            var orderInDb = _SupplicoContext.Orders.FirstOrDefaultAsync(o => o.OrderId == order.OrderId).Result;
            if (orderInDb == null) return NotFound("The specific order you are looking for is not found");
            else
            {
                orderInDb.Pallets = order.Pallets;
                await _SupplicoContext.SaveChangesAsync();
                return NoContent();
            }
        }
    }
}
