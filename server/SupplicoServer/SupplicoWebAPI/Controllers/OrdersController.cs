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
                    DriverFullName = o.Driver.FullName,
                    SupplierFullName = o.Supplier.FullName,
                    BusinessFullName = o.Business.FullName,
                    Created = o.Created,
                })
                .ToList();
            if (orders.Count > 0)
            {
                return Ok(orders);
            }

            else return NotFound("User has no orders");
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
    }
}
