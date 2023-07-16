using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplicoDAL;
using SupplicoWebAPI.DTO;
using SupplicoWebAPI.Utils;
using System;

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

        [HttpGet("{userID:int}")]
        public IActionResult GetUserProfile(int userID)
        {
            var user = _SupplicoContext.Users.Find(userID);
            if (user == null)
                return NotFound();
            else
                return Ok(new UserResponse(user));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_SupplicoContext.Users == null) return NotFound("No users in database");
            else return await _SupplicoContext.Users.ToListAsync();
        }

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            var userInDb = _SupplicoContext.Users.FirstOrDefault(u => u.UserName == user.UserName);
            if (userInDb == null) return Unauthorized("Invalid username or password");
            else
            {
                var ph = new PasswordHasher<User>();
                var result = ph.VerifyHashedPassword(userInDb, userInDb.Password, user.Password);
                if (userInDb == null || result == PasswordVerificationResult.Failed)
                    return Unauthorized("invalid user name or password");
                else if (userInDb.IsAccepted == false && result == PasswordVerificationResult.Success && userInDb != null) return Unauthorized("Your user still waiting to be accepted by an admin, please come back later");
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
            if (_SupplicoContext.Users.Any(e => e.UserName == uwi.UserName)) return BadRequest("Username already been taken");
            else if (_SupplicoContext.Users.Any(e => e.Email == uwi.Email)) return BadRequest("Email already been taken");
            else if (_SupplicoContext.Users.Any(e => e.FullName == uwi.FullName)) return BadRequest("Full name already been taken");
            else if (_SupplicoContext.Users.Any(e => e.PhoneNumber == uwi.PhoneNumber)) return BadRequest("Phone number already been taken");
            else if (!ModelState.IsValid) return BadRequest("request data is invalid");
            else
            {
                await SetImage(uwi);
                return await Register(uwi);
            }
        }

        public async Task<ActionResult<User>> Register(User user)
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

        [HttpPut()]
        public async Task<IActionResult> ChangeActivation(User user)
        {
            var userInDb = _SupplicoContext.Users.FirstOrDefaultAsync(x => x.UserId == user.UserId).Result;
            if (userInDb == null) return NotFound("The specific user you are looking for is not found");
            else
            {
                if (userInDb.IsAccepted)
                {
                    userInDb.IsAccepted = false;
                }
                else userInDb.IsAccepted = true;
                await _SupplicoContext.SaveChangesAsync();
                return NoContent();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id) 
        {
            var user = await _SupplicoContext.Users.FindAsync(id);
            if (user == null) return NotFound("The specific user you are looking for is not found");
            else
            {
                _SupplicoContext.Users.Remove(user);
                await _SupplicoContext.SaveChangesAsync();
                return NoContent();
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
