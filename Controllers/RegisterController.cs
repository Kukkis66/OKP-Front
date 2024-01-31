using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OKPBackend.Models.Domain;
using OKPBackend.Models.DTO.Users;
using OKPBackend.Repositories.Users;

namespace OKPBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly IConfiguration config;
        // private readonly IUsersRepository usersRepository;

        private readonly IMapper mapper;
        private readonly UserManager<User> userManager;

        public RegisterController(IConfiguration config, IMapper mapper, UserManager<User> userManager)
        {
            this.mapper = mapper;
            this.userManager = userManager;
            // this.usersRepository = usersRepository;
            this.config = config;

        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
        {
            if (userRegisterDto.Password != userRegisterDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            var newUser = new User
            {
                Email = userRegisterDto.Email,
                UserName = userRegisterDto.Username,
                PasswordHash = userRegisterDto.Password
            };

            var identityResult = await userManager.CreateAsync(newUser, userRegisterDto.Password);

            if (identityResult.Succeeded)
            {
                // Add roles
                if (userRegisterDto.Roles != null && userRegisterDto.Roles.Any())
                {

                    var rolesResponse = await userManager.AddToRolesAsync(newUser, userRegisterDto.Roles);

                    if (rolesResponse.Succeeded)
                    {
                        return Ok("User was registered");
                    }
                }
            }

            return BadRequest("Failed to register user: " + string.Join(", ", identityResult.Errors.Select(e => e.Description)));
        }

        // [AllowAnonymous]
        // [HttpPost]
        // public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         var newUser = await usersRepository.CreateAsync(userRegisterDto);
        //         return Ok(mapper.Map<UserDto>(newUser));
        //     }

        //     return BadRequest("Something went wrong");
        // }
    }
}