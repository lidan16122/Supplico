using Microsoft.AspNetCore.Authorization;
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
        private readonly TokensManager _TokensManager;
        private readonly SupplicoContext _SupplicoContext;
        private readonly ILogger<UsersController> _logger;
        public UsersController(TokensManager tokensManager, SupplicoContext supplicoContext, ILogger<UsersController> logger)
        {
            _TokensManager = tokensManager;
            _SupplicoContext = supplicoContext;
            _logger = logger;
        }

        [HttpGet("suppliers")]
        public async Task<ActionResult<IEnumerable<User>>> GetSuppliers()
        {
            _logger.LogInformation("GetSuppliers method initiated");
            if (_SupplicoContext.Users.Where(u => u.RoleId == 3).Count() == 0)
            {
                _logger.LogWarning("GetSuppliers: no suppliers in database, returning 404 statuscode");
                return NotFound("No suppliers in database");
            }
            else
            {
                try
                {
                    return await _SupplicoContext.Users.Where(u => u.RoleId == 3).Where(u => u.IsAccepted == true).ToListAsync();
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetSuppliers method completed");
                }

            }
        }

        [HttpGet("{userID:int}")]
        public IActionResult GetUserProfile(int userID)
        {
            _logger.LogInformation("GetUserProfile method initiated");
            var user = _SupplicoContext.Users.Find(userID);
            if (user == null)
            {
                _logger.LogWarning("GetUserProfile: user not found in database, returning 404 statuscode");
                return NotFound();
            }
            else
                try
                {
                    return Ok(new UserResponse(user));
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetUserProfile method completed");
                }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            _logger.LogInformation("GetUsers method initiated");
            if (_SupplicoContext.Users == null)
            {
                _logger.LogWarning("GetUsers: no users found in database, returning 404 statuscode");
                return NotFound("No users in database");
            }
            else
            {
                try
                {
                    return await _SupplicoContext.Users.ToListAsync();
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("GetUsers method completed");
                }
            }
        }

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            _logger.LogInformation("Login method initiated");
            var userInDb = _SupplicoContext.Users.FirstOrDefault(u => u.UserName == user.UserName);
            if (userInDb == null)
            {
                _logger.LogWarning("Login: Invalid username or password, returning 401 statuscode");
                return Unauthorized("Invalid username or password");
            }
            else
            {
                var ph = new PasswordHasher<User>();
                var result = ph.VerifyHashedPassword(userInDb, userInDb.Password, user.Password);
                if (userInDb == null || result == PasswordVerificationResult.Failed)
                {
                    _logger.LogWarning("Login: Invalid username or password (password verifcation result failed), returning 401 statuscode");
                    return Unauthorized("invalid user name or password");
                }
                else if (userInDb.IsAccepted == false && result == PasswordVerificationResult.Success && userInDb != null)
                {
                    _logger.LogWarning("Login: The user still waiting to be accepted by an admin, returning 401 statuscode");
                    return Unauthorized("Your user still waiting to be accepted by an admin, please come back later");
                }
                else
                {
                    try
                    {
                        LoginResponse lr = new LoginResponse()
                        {
                            TokensData = GetNewTokensAndSave2DB(userInDb),
                            UserResponse = new UserResponse(userInDb)
                        };
                        return Ok(lr);
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e, e.Message);
                        return StatusCode(500);
                    }
                    finally
                    {
                        _logger.LogInformation("Login method completed");
                    }
                }
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisteImage([FromForm] UserWithImage uwi)
        {
            _logger.LogInformation("RegisterImage method initiated");
            if (_SupplicoContext.Users.Any(e => e.UserName == uwi.UserName))
            {
                _logger.LogWarning("RegisterImage: username already been taken, returning 400 statuscode");
                return BadRequest("Username already been taken");
            }
            else if (_SupplicoContext.Users.Any(e => e.Email == uwi.Email))
            {
                _logger.LogWarning("RegisterImage: email already been taken, returning 400 statuscode");
                return BadRequest("Email already been taken");
            }
            else if (_SupplicoContext.Users.Any(e => e.FullName == uwi.FullName))
            {
                _logger.LogWarning("RegisterImage: name already been taken, returning 400 statuscode");
                return BadRequest("Full name already been taken");
            }
            else if (_SupplicoContext.Users.Any(e => e.PhoneNumber == uwi.PhoneNumber))
            {
                _logger.LogWarning("RegisterImage: phone number already been taken, returning 400 statuscode");
                return BadRequest("Phone number already been taken");
            }
            else if (!ModelState.IsValid)
            {
                _logger.LogWarning("RegisterImage: data input is invalid, returning 400 statuscode");
                return BadRequest("request data is invalid");
            }
            else
            {
                try
                {
                    await SetImage(uwi);
                    return await Register(uwi);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("RegisterImage method completed");
                }
            }
        }

        public async Task<ActionResult<User>> Register(User user)
        {
            _logger.LogInformation("Register method initiated");
            var ph = new PasswordHasher<User>();
            user.Password = ph.HashPassword(user, user.Password);
            _SupplicoContext.Users.Add(user);
            try
            {
                await _SupplicoContext.SaveChangesAsync();
                LoginResponse lr = new LoginResponse()
                {
                    TokensData = GetNewTokensAndSave2DB(user),
                    UserResponse = new UserResponse(user)
                };
                return Created($"/users/{user.UserId}", lr);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return StatusCode(500);
            }
            finally
            {
                _logger.LogInformation("Register method completed");
            }
        }

        [HttpPut()]
        public async Task<IActionResult> ChangeActivation(User user)
        {
            _logger.LogInformation("ChangeActivation method initiated");
            var userInDb = _SupplicoContext.Users.FirstOrDefaultAsync(x => x.UserId == user.UserId).Result;
            if (userInDb == null)
            {
                _logger.LogWarning("ChangeActivation: user not found in database, returning 404 statuscode");
                return NotFound("The specific user you are looking for is not found");
            }
            else
            {
                if (userInDb.IsAccepted)
                {
                    userInDb.IsAccepted = false;
                }
                else userInDb.IsAccepted = true;
                try
                {
                    await _SupplicoContext.SaveChangesAsync();
                    return NoContent();

                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("ChangeActivation method completed");
                }
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            _logger.LogInformation("DeleteUser method initiated");
            var user = await _SupplicoContext.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogWarning("DeleteUser: user not found in database, returning 404 statuscode");
                return NotFound("The specific user you are looking for is not found");
            }
            else
            {
                _SupplicoContext.Users.Remove(user);

                try
                {
                    await _SupplicoContext.SaveChangesAsync();
                    return NoContent();

                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message);
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("DeleteUser method completed");
                }
            }
        }

        [HttpPost("refreshToken")]
        public IActionResult RefreshToken(TokensData td)
        {
            _logger.LogInformation("RefreshToken method initiated");
            var userInDb = _SupplicoContext.Users.FirstOrDefault(u => u.RefreshToken == td.RefreshToken && u.RefreshTokenExpires > DateTime.Now);
            if (userInDb == null)
            {
                _logger.LogWarning("RefreshToken: token invalid, returning 401 statuscode");
                return Unauthorized("token invalid");
            }
            else
            {
                try
                {
                    LoginResponse lr = new LoginResponse()
                    {
                        TokensData = GetNewTokensAndSave2DB(userInDb),
                        UserResponse = new UserResponse(userInDb)
                    };
                    return Ok(lr);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, e.Message + " refresh token has failed");
                    return StatusCode(500);
                }
                finally
                {
                    _logger.LogInformation("RefreshToken method completed");
                }
            }
        }

        async Task SetImage(UserWithImage uwi)
        {
            _logger.LogInformation("SetImage method initiated");
            FilesManager fm = FilesManager.GetIntance();
            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await uwi.Image.CopyToAsync(memoryStream);
                    uwi.ImageData = fm.GetImageString(uwi.Image.FileName, memoryStream.ToArray());
                }
                uwi.ImageName = uwi.Image.FileName;
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message + " failed to save user image");
            }
            finally
            {
                _logger.LogInformation("SetImage method completed");
            }

        }

        TokensData GetNewTokensAndSave2DB(User user)
        {
            _logger.LogInformation("GetNewTokensAndSave2DB method initiated");
            try
            {
                TokensData td = _TokensManager.GetInitializedTokens(user);
                SaveRefreshToken2DB(user, td);
                return td;
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message + " failed to get a new token and save");
                return null;
            }
            finally
            {
                _logger.LogInformation("GetNewTokensAndSave2DB method completed");
            }
        }

        void SaveRefreshToken2DB(User userInDb, TokensData td)
        {
            _logger.LogInformation("SaveRefreshToken2DB method initiated");
            try
            {
                userInDb.RefreshToken = td.RefreshToken;
                userInDb.RefreshTokenExpires = td.RefreshTokenExpires;
                _SupplicoContext.SaveChanges();
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message + " failed to refresh a token");
            }
            finally
            {
                _logger.LogInformation("SaveRefreshToken2DB method completed");
            }
        }

        


    }
}
