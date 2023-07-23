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
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders(int userID)
        {
            if (_SupplicoContext.Orders == null) return NotFound("No orders in database");
            else return await _SupplicoContext.Orders.ToListAsync();
        }
        [HttpGet("{userID:int}")]
        public ActionResult<IEnumerable<Product>> GetUserOrders(int userID)
        {
            object orders;
            if (_SupplicoContext.Orders.Where(o => o.BusinessId == userID).Count() > 0)
            {
                orders = _SupplicoContext.Orders.Where(o => o.BusinessId == userID)
                        .Include(o => o.Driver)
                        .Include(o => o.Business)
                        .Include(o => o.Supplier)
                        .Select(o => new
                        {
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
                        });
                return Ok(orders);
            }

            else if (_SupplicoContext.Orders.Where(o => o.DriverId == userID).Count() > 0)
            {
                orders = _SupplicoContext.Orders.Where(o => o.DriverId == userID).Include(o => o.Driver)
                        .Include(o => o.Business)
                        .Include(o => o.Supplier)
                        .Select(o => new
                        {
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
                        });
                return Ok(orders);
            }

            else if (_SupplicoContext.Orders.Where(o => o.SupplierId == userID).Count() > 0)
            {
                orders = _SupplicoContext.Orders.Where(o => o.SupplierId == userID).Include(o => o.Driver)
                        .Include(o => o.Business)
                        .Include(o => o.Supplier)
                        .Select(o => new
                        {
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
                        });
                return Ok(orders);
            }

            else
            {

                return NotFound("User has no orders");
            }
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
