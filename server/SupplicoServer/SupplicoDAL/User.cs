using System;
using System.Collections.Generic;

namespace SupplicoDAL;

public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? FullName { get; set; } = null!;

    public string? Email { get; set; } = null!;

    public string? PhoneNumber { get; set; } = null!;

    public int? RoleId { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpires { get; set; }

    public string? ImageName { get; set; } = null!;

    public string? ImageData { get; set; } = null!;

    public bool IsAccepted { get; set; }

    public virtual ICollection<Order> OrderBusinesses { get; set; } = new List<Order>();

    public virtual ICollection<Order> OrderDrvers { get; set; } = new List<Order>();

    public virtual ICollection<Order> OrderSuppliers { get; set; } = new List<Order>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
