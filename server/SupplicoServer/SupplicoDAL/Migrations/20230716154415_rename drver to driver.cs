using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplicoDAL.Migrations
{
    /// <inheritdoc />
    public partial class renamedrvertodriver : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Orders__DrverId__440B1D61",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "DrverId",
                table: "Orders",
                newName: "DriverId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_DrverId",
                table: "Orders",
                newName: "IX_Orders_DriverId");

            migrationBuilder.AddForeignKey(
                name: "FK__Orders__DriverId__440B1D61",
                table: "Orders",
                column: "DriverId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Orders__DriverId__440B1D61",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "DriverId",
                table: "Orders",
                newName: "DrverId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_DriverId",
                table: "Orders",
                newName: "IX_Orders_DrverId");

            migrationBuilder.AddForeignKey(
                name: "FK__Orders__DrverId__440B1D61",
                table: "Orders",
                column: "DrverId",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
