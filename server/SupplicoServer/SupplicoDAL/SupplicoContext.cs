using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SupplicoDAL;

public partial class SupplicoContext : DbContext
{
    public SupplicoContext()
    {
    }

    public SupplicoContext(DbContextOptions<SupplicoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=Supplico;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF7A5D7210");

            entity.HasIndex(e => e.TransactionId, "UQ__Orders__55433A4AC965FA52").IsUnique();

            entity.Property(e => e.Created).HasColumnType("datetime");
            entity.Property(e => e.Sum).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.TransactionId)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("TransactionID");

            entity.HasOne(d => d.Business).WithMany(p => p.OrderBusinesses)
                .HasForeignKey(d => d.BusinessId)
                .HasConstraintName("FK__Orders__Business__49C3F6B7");

            entity.HasOne(d => d.Drver).WithMany(p => p.OrderDrvers)
                .HasForeignKey(d => d.DrverId)
                .HasConstraintName("FK__Orders__DrverId__47DBAE45");

            entity.HasOne(d => d.Supplier).WithMany(p => p.OrderSuppliers)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK__Orders__Supplier__48CFD27E");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__OrderIte__3214EC0704D53BA9");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK__OrderItem__Order__571DF1D5");

            entity.HasOne(d => d.ProductNavigation).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.Product)
                .HasConstraintName("FK__OrderItem__Produ__5812160E");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Products__3214EC0752E3C9A1");

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.User).WithMany(p => p.Products)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Products__UserId__3B75D760");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CC5B1F462");

            entity.HasIndex(e => e.UserName, "UQ__Users__C9F284567AD65261").IsUnique();

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ImageData).IsUnicode(false);
            entity.Property(e => e.ImageName)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Passowrd)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.RefreshToken).IsUnicode(false);
            entity.Property(e => e.RefreshTokenExpires).HasColumnType("datetime");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.UserName)
                .HasMaxLength(16)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
