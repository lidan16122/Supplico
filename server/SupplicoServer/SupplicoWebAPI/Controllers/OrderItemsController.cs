using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;

namespace SupplicoWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        SupplicoContext _SupplicoContext;
        public OrderItemsController(SupplicoContext supplicoContext)
        {
            _SupplicoContext = supplicoContext;
        }
        [HttpGet]
        public ActionResult<IEnumerable<OrderItem>> GetOrderItems()
        {
            if (_SupplicoContext.OrderItems == null) return NotFound("No order items in database");
            else
            {
                var orderItems = _SupplicoContext.OrderItems
                        .Include(o => o.Product)
                        .Include(o => o.Order)
                        .Select(o => new
                        {
                            Id = o.Id,
                            Quantity = o.Quantity,
                            OrderId = o.OrderId,
                            ProductId = o.ProductId,
                            Transaction = o.Order.TransactionId,
                            ProductName = o.Product.Name
                        }).ToList();
                return Ok(orderItems);
            }         
        }
        [HttpPost]
        public async Task<ActionResult<OrderItem>> PostOrderItem(OrderItem orderItem)
        {
            if (!ModelState.IsValid) return BadRequest("request data is invalid");
            else
            {
                var lastOrder = _SupplicoContext.Orders.ToList().LastOrDefault();
                orderItem.OrderId = lastOrder.OrderId;
                _SupplicoContext.OrderItems.Add(orderItem);
                await _SupplicoContext.SaveChangesAsync();
                return Created($"/orderItems/{orderItem.Id}", orderItem);
            }
        }

    }
}
