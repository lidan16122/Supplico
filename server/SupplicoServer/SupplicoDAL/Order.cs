using System;
using System.Collections.Generic;

namespace SupplicoDAL;

public partial class Order
{
    public int OrderId { get; set; }

    public string? TransactionId { get; set; }

    public decimal Sum { get; set; }

    public int Quantity { get; set; }

    public int? Pallets { get; set; }

    public bool SupplierConfirmation { get; set; }

    public bool DriverConfirmation { get; set; }
    public bool BusinessConfirmation { get; set; }


    public int? DriverId { get; set; }

    public int? SupplierId { get; set; }

    public int? BusinessId { get; set; }

    public DateTime? Created { get; set; }

    public virtual User? Business { get; set; }

    public virtual User? Driver { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual User? Supplier { get; set; }
}
