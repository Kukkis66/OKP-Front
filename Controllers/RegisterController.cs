using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using OKPBackend.Models.Domain;
using OKPBackend.Models.DTO.Users;
using OKPBackend.Repositories.Users;
using OKPBackend.Services;

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
        private readonly EmailService emailService;

        public RegisterController(IConfiguration config, IMapper mapper, UserManager<User> userManager, EmailService emailService)
        {
            this.mapper = mapper;
            this.userManager = userManager;
            this.emailService = emailService;
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

            // if (identityResult.Succeeded)
            // {
            //     // Add roles
            //     if (userRegisterDto.Roles != null && userRegisterDto.Roles.Any())
            //     {

            //         var rolesResponse = await userManager.AddToRolesAsync(newUser, userRegisterDto.Roles);

            //         if (rolesResponse.Succeeded)
            //         {
            //             return Ok("User was registered");
            //         }
            //     }
            // }
            var rolesResponse = await userManager.AddToRolesAsync(newUser, userRegisterDto.Roles);

            try
            {
                if (await SendConfirmEmailAsync(newUser))
                {
                    return Ok(new JsonResult(new { title = "Account Created", message = "Your account has been created, please confirm your email address" }));
                }
            }
            catch (System.Exception)
            {
                return BadRequest("Email failed");
            };


            return BadRequest("Failed to register user: " + string.Join(", ", identityResult.Errors.Select(e => e.Description)));
        }

        private async Task<bool> SendConfirmEmailAsync(User user)
        {
            DotNetEnv.Env.Load();
            string confirm_email_path = Environment.GetEnvironmentVariable("confirm_email_path");
            string reset_password_path = Environment.GetEnvironmentVariable("reset_password_path");
            string application_name = Environment.GetEnvironmentVariable("application_name");

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            Console.WriteLine(user.Email);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{config["Jwt:Issuer"]}/{confirm_email_path}?token={token}&email={user.Email}";

            var body = $"<p>Hello: {user.UserName}</p> + <p>Please confirm your email address by clicking on the following link.</p>" +
                        $"<p><a href=\"{url}\">Click Here</a></p>" +
                        "<p>Thank you</p>" +
                        $"<br>{application_name}";

            var emailSend = new EmailSendDto(user.Email, "Confirm your email", body);

            return await emailService.SendEmailAsync(emailSend);


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