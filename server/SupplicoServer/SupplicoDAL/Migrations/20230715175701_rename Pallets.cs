using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplicoDAL.Migrations
{
    /// <inheritdoc />
    public partial class renamePallets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Palltes",
                table: "Orders",
                newName: "Pallets");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Pallets",
                table: "Orders",
                newName: "Palltes");
        }
    }
}
