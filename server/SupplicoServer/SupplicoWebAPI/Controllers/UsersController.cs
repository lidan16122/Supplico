using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;
using SupplicoWebAPI.DTO;
using SupplicoWebAPI.Utils;

namespace SupplicoWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        TokensManager _TokensManager;
        SupplicoContext _SupplicoContext;
        FilesManager _FilesManager;

        public UsersController(TokensManager tokensManager, SupplicoContext supplicoContext, FilesManager filesManager)
        {
            _TokensManager = tokensManager;
            _SupplicoContext = supplicoContext;
            _FilesManager = filesManager;
        }

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            var userInDb = _SupplicoContext.Users.FirstOrDefault(u => u.UserName == user.UserName);
            if (userInDb == null)
                return Unauthorized("invalid user name or password");
            else
            {
                var ph = new PasswordHasher<User>();
                var result = ph.VerifyHashedPassword(userInDb, userInDb.Password, user.Password);
                if (userInDb == null || result == PasswordVerificationResult.Failed)
                    return Unauthorized("invalid user name or password");
                else
                {
                    LoginResponse lr = new LoginResponse()
                    {
                        TokensData = GetNewTokensAndSave2DB(userInDb),
                        UserResponse = new UserResponse(userInDb)
                    };
                    return Ok(lr);
                }
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisteImage([FromForm] UserWithImage uwi)
        {
            await SetImage(uwi);
            return await Register(uwi);
        }

        [HttpPost]
        public async Task<ActionResult<User>> Register(User user)
        {
            if (!ModelState.IsValid)
                return BadRequest("request data is invalid");
            else
            {
                var ph = new PasswordHasher<User>();
                user.Password = ph.HashPassword(user, user.Password);
                _SupplicoContext.Users.Add(user);
                await _SupplicoContext.SaveChangesAsync();
                LoginResponse lr = new LoginResponse()
                {
                    TokensData = GetNewTokensAndSave2DB(user),
                    UserResponse = new UserResponse(user)
                };
                return Created($"/users/{user.UserId}", lr);
            }
        }

        [HttpPost("refreshToken")]
        public IActionResult RefreshToken(TokensData td)
        {
            var userInDb = _SupplicoContext.Users.FirstOrDefault(u => u.RefreshToken == td.RefreshToken && u.RefreshTokenExpires > DateTime.Now);
            if (userInDb == null)
            {
                return Unauthorized("token invalid");
            }
            else
            {
                LoginResponse lr = new LoginResponse()
                {
                    TokensData = GetNewTokensAndSave2DB(userInDb),
                    UserResponse = new UserResponse(userInDb)
                };
                return Ok(lr);
            }
        }

        async Task SetImage(UserWithImage uwi)
        {

                using (var memoryStream = new MemoryStream())
                {
                    await uwi.Image.CopyToAsync(memoryStream);
                    //pwi.ImageData = memoryStream.ToArray();
                    uwi.ImageData = _FilesManager.GetImageString(uwi.Image.FileName, memoryStream.ToArray());
                }
                //_FilesManager.SaveFile(pwi.Image);//saving in file system
                uwi.ImageName = uwi.Image.FileName;
                      
        }

        TokensData GetNewTokensAndSave2DB(User user)
        {
            TokensData td = _TokensManager.GetInitializedTokens(user);
            //SaveCookiesToResponse(td);
            SaveRefreshToken2DB(user, td);
            return td;
        }

        void SaveRefreshToken2DB(User userInDb, TokensData td)
        {
            userInDb.RefreshToken = td.RefreshToken;
            userInDb.RefreshTokenExpires = td.RefreshTokenExpires;
            _SupplicoContext.SaveChanges();
        }

        void SaveCookiesToResponse(TokensData td)
        {
            Response.Cookies.Append("accessToken", td.AccessToken, new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = td.AccessTokenExpires
            });
            Response.Cookies.Append("refreshToken", td.RefreshToken, new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = td.RefreshTokenExpires
            });
        }
    }
}
