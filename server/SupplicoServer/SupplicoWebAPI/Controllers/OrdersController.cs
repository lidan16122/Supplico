using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;

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
    }
}
