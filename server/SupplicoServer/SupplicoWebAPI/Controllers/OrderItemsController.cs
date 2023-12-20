using Microsoft.AspNetCore.Authorization;
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
        private readonly SupplicoContext _SupplicoContext;
        private readonly ILogger<OrderItemsController> _logger;
        public OrderItemsController(SupplicoContext supplicoContext, ILogger<OrderItemsController> logger)
        {
            _SupplicoContext = supplicoContext;
            _logger = logger;
        }
        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<OrderItem>> GetOrderItems()
        {
            _logger.LogInformation("GetOrderItems method initiated");
            if (_SupplicoContext.OrderItems == null)
            {
                _logger.LogWarning("GetOrderItems: no order items in database, returning 404 statuscode");
                return NotFound("No order items in database");
            }
            else
            {
                try
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
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetOrderItems method completed");
                }
            }
        }
        [HttpGet("{userID:int}")]
        [Authorize]
        public ActionResult<IEnumerable<OrderItem>> GetUserOrderItems(int userID)
        {
            _logger.LogInformation("GetUserOrderItems method initiated");
            if (_SupplicoContext.OrderItems.Where(o => o.Order.SupplierId == userID || o.Order.BusinessId == userID || o.Order.DriverId == userID).Count() < 0)
            {
                _logger.LogWarning("GetUserOrderItems: this user has no order items in database, returning 404 statuscode");
                return NotFound("Order items not found");
            }
            else
            {
                try
                {
                var orderItems = _SupplicoContext.OrderItems
                        .Where(o => o.Order.SupplierId == userID || o.Order.BusinessId == userID || o.Order.DriverId == userID)
                        .Include(o => o.Product)
                        .Include(o => o.Order)
                        .Select(o => new
                        {
                            Id = o.Id,
                            Quantity = o.Quantity,
                            Transaction = o.Order.TransactionId,
                            ProductName = o.Product.Name
                        }).ToList();
                return Ok(orderItems);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetUserOrderItems method completed");
                }
            }
        }
        [HttpGet("display-order/{orderID:int}")]
        [Authorize]
        public IActionResult DisplayOrderItems(int orderID)
        {
            _logger.LogInformation("DisplayOrderItems method initiated");
            if (_SupplicoContext.OrderItems.FirstOrDefault(o => o.OrderId == orderID) == null)
            {
                _logger.LogWarning("DisplayOrderItems: order items not found in database, returning 404 statuscode");
                return NotFound("Order items not found");
            }
            else
            {
                try
                {
                    var orderItems = _SupplicoContext.OrderItems
                        .Where(o => o.OrderId == orderID)
                        .Include(o => o.Product)
                        .Select(o => new
                        {
                            Id = o.Id,
                            Quantity = o.Quantity,
                            ProductName = o.Product.Name
                        });
                    return Ok(orderItems);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("DisplayOrderItems method completed");
                }
            }

        }
        [HttpPost]
        public async Task<ActionResult<OrderItem>> PostOrderItem(OrderItem orderItem)
        {
            _logger.LogInformation("PostOrderItem method initiated");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("PostOrderItem: order items data input is invalid, returning 404 statuscode");
                return BadRequest("request data is invalid");
            }
            else
            {
                var lastOrder = _SupplicoContext.Orders.ToList().LastOrDefault();
                orderItem.OrderId = lastOrder.OrderId;
                _SupplicoContext.OrderItems.Add(orderItem);
                try
                {
                    await _SupplicoContext.SaveChangesAsync();
                    return Created($"/orderItems/{orderItem.Id}", orderItem);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("PostOrderItem method completed");
                }
            }
        }

    }
}
