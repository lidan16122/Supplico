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
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            if (_SupplicoContext.Orders == null) return NotFound("No users in database");
            else return await _SupplicoContext.Orders.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            if (!ModelState.IsValid) return BadRequest("request data is invalid");
            else if (order == null) return BadRequest("order is null");
            else
            {
                order.TransactionId = Guid.NewGuid().ToString();
                order.Created = DateTime.Now;
                _SupplicoContext.Orders.Add(order);
                await _SupplicoContext.SaveChangesAsync();
                return Created($"/orders/{order.OrderId}", order);
            }
        }
    }
}
