namespace SupplicoDAL;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public int? UserId { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual User? User { get; set; }
}
