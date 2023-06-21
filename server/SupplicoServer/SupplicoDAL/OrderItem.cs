using System;
using System.Collections.Generic;

namespace SupplicoDAL;

public partial class OrderItem
{
    public int Id { get; set; }

    public int? Quantity { get; set; }

    public int? OrderId { get; set; }

    public int? Product { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Product? ProductNavigation { get; set; }
}
