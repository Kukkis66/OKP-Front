using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OKPBackend.Models.Domain;
using OKPBackend.Models.DTO.Users;
using OKPBackend.Repositories.Users;

namespace OKPBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly IUsersRepository usersRepository;

        public LoginController(IConfiguration config, IUsersRepository usersRepository)
        {

            this.config = config;
            this.usersRepository = usersRepository;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            //Check if the user exists and if the password is correct
            var user = await Authenticate(userLoginDto);

            if (user == null)
            {
                return NotFound("User not found");
            }
            //Generate a jwt token for the user
            var token = Generate(user);

            return Ok(token);


        }

        private async Task<User?> Authenticate(UserLoginDto userLoginDto)
        {

            var currentUser = await usersRepository.GetByUsername(userLoginDto);

            if (currentUser == null)
            {
                return null;
            }

            if (!BCrypt.Net.BCrypt.Verify(userLoginDto.Password, currentUser.PasswordHash))
            {
                return null;
            }

            return currentUser;
        }

        private string Generate(User user)
        {
            DotNetEnv.Env.Load();
            string jwt_key = Environment.GetEnvironmentVariable("jwt_key");
            //config["Jwt:Key"]
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt_key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(config["Jwt:Issuer"], config["Jwt:Audience"], claims, expires: DateTime.Now.AddMinutes(20), signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}