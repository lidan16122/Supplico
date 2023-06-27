using SupplicoDAL;
namespace SupplicoWebAPI.DTO
{
    public class UserResponse
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int? RoleID { get; set; }
        public string RoleName { get; set; }

        public UserResponse() { }

        public UserResponse(User user)
        {
            UserId = user.UserId;
            UserName = user.UserName;
            RoleID = user.RoleId;
            if (RoleID == 1)
                RoleName = "Business";
            else if (RoleID == 2)
                RoleName = "Driver";
            else if (RoleID == 3)
                RoleName = "Supplier";
            else if (RoleID == 4)
                RoleName = "Admin";
            else RoleName= "Undefined";
        }
    }
}
