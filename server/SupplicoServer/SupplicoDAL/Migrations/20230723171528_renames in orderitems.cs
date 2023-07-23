using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplicoDAL.Migrations
{
    /// <inheritdoc />
    public partial class renamesinorderitems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Product",
                table: "OrderItems",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_Product",
                table: "OrderItems",
                newName: "IX_OrderItems_ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "OrderItems",
                newName: "Product");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                newName: "IX_OrderItems_Product");
        }
    }
}
