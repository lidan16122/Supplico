using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplicoDAL.Migrations
{
    /// <inheritdoc />
    public partial class addedadmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "FullName", "ImageData", "ImageName", "IsAccepted", "Password", "PhoneNumber", "RefreshToken", "RefreshTokenExpires", "RoleID", "UserName" },
                values: new object[] { 5, "admin@gmail.com", "Admin Rashi", null, null, true, "AQAAAAEAACcQAAAAEF0yg+txDUNebuNSw+ieaIC/H0Xeu+MUqB/doLTDmBR59cwAl+QwMkMftjY2SMh7ww==", "000000000", null, null, 4, "admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5);
        }
    }
}
