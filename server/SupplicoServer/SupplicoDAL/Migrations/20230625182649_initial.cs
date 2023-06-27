﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SupplicoDAL.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "varchar(16)", unicode: false, maxLength: 16, nullable: false),
                    Passowrd = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false, defaultValueSql: "(N'')"),
                    FullName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    RoleID = table.Column<int>(type: "int", nullable: true),
                    RefreshToken = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    RefreshTokenExpires = table.Column<DateTime>(type: "datetime", nullable: true),
                    ImageName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    ImageData = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    IsAccepted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CC4CA06EA235", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TransactionID = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Sum = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Palltes = table.Column<int>(type: "int", nullable: true),
                    SupplierConfirmation = table.Column<bool>(type: "bit", nullable: false),
                    DriverConfirmation = table.Column<bool>(type: "bit", nullable: false),
                    DrverId = table.Column<int>(type: "int", nullable: true),
                    SupplierId = table.Column<int>(type: "int", nullable: true),
                    BusinessId = table.Column<int>(type: "int", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Orders__C3905BCF2AF0F936", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK__Orders__Business__45F365D3",
                        column: x => x.BusinessId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK__Orders__DrverId__440B1D61",
                        column: x => x.DrverId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK__Orders__Supplier__44FF419A",
                        column: x => x.SupplierId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Products__3214EC072E73F968", x => x.Id);
                    table.ForeignKey(
                        name: "FK__Products__UserId__3E52440B",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    OrderId = table.Column<int>(type: "int", nullable: true),
                    Product = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderIte__3214EC07BF992611", x => x.Id);
                    table.ForeignKey(
                        name: "FK__OrderItem__Order__48CFD27E",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId");
                    table.ForeignKey(
                        name: "FK__OrderItem__Produ__49C3F6B7",
                        column: x => x.Product,
                        principalTable: "Products",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "FullName", "ImageData", "ImageName", "IsAccepted", "Passowrd", "PhoneNumber", "RefreshToken", "RefreshTokenExpires", "RoleID", "UserName" },
                values: new object[,]
                {
                    { 1, "business@gmail.com", "LocalBusiness", "data:image/jpeg;base64,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", "peaches.jpeg", false, "AQAAAAEAACcQAAAAEF0yg+txDUNebuNSw+ieaIC/H0Xeu+MUqB/doLTDmBR59cwAl+QwMkMftjY2SMh7ww==", "081234567", null, null, 1, "business" },
                    { 2, "business2@gmail.com", "LocalBusiness2", "data:image/jpeg;base64,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", "Bannana.jpeg", true, "AQAAAAEAACcQAAAAEF0yg+txDUNebuNSw+ieaIC/H0Xeu+MUqB/doLTDmBR59cwAl+QwMkMftjY2SMh7ww==", "089876543", null, null, 1, "business2" },
                    { 3, "supplier@gmail.com", "Supplier", "data:image/jpeg;base64,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", "Apples.jpeg", true, "AQAAAAEAACcQAAAAEF0yg+txDUNebuNSw+ieaIC/H0Xeu+MUqB/doLTDmBR59cwAl+QwMkMftjY2SMh7ww==", "0721234567", null, null, 3, "supplier" },
                    { 4, "driver@gmail.com", "Driver", "data:image/jpeg;base64,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", "Water_melon.jpeg", false, "AQAAAAEAACcQAAAAEF0yg+txDUNebuNSw+ieaIC/H0Xeu+MUqB/doLTDmBR59cwAl+QwMkMftjY2SMh7ww==", "0501234567", null, null, 2, "driver" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Name", "Price", "UserId" },
                values: new object[,]
                {
                    { 1, "Coca-Cola", 3.3m, 3 },
                    { 2, "Fanta", 2.9m, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_Product",
                table: "OrderItems",
                column: "Product");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_BusinessId",
                table: "Orders",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DrverId",
                table: "Orders",
                column: "DrverId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_SupplierId",
                table: "Orders",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "UQ__Orders__55433A4A7BB1E263",
                table: "Orders",
                column: "TransactionID",
                unique: true,
                filter: "[TransactionID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Products_UserId",
                table: "Products",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__85FB4E381107C15E",
                table: "Users",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Users__89C60F11576F77BB",
                table: "Users",
                column: "FullName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Users__A9D105343F70E798",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Users__C9F2845679C32E47",
                table: "Users",
                column: "UserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
