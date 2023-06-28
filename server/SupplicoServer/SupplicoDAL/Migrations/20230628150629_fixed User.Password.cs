using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplicoDAL.Migrations
{
    /// <inheritdoc />
    public partial class fixedUserPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Passowrd",
                table: "Users",
                newName: "Password");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Users",
                newName: "Passowrd");
        }
    }
}
