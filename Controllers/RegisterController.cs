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
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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
            var url = $"{config["Jwt:Issuer"]}{confirm_email_path}?token={token}&email={user.Email}";

            var body = $"<p>Hello: {user.UserName}</p> + <p>Please confirm your email address by clicking on the following link.</p>" +
                        $"<p><a href=\"{url}\">Click Here</a></p>" +
                        "<p>Thank you</p>" +
                        $"<br>{application_name}";

            var emailSend = new EmailSendDto(user.Email, "Confirm your email", body);

            return await emailService.SendEmailAsync(emailSend);


        }

        [HttpPut("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            var user = await userManager.FindByEmailAsync(confirmEmailDto.Email);
            if (user == null)
            {
                return Unauthorized("This email address has not been registered yet.");
            }

            if (user.EmailConfirmed == true)
            {
                return BadRequest("Your email was confirmed before. Please login to your account");
            }

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(confirmEmailDto.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await userManager.ConfirmEmailAsync(user, decodedToken);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { title = "Email Confirmed", message = "Your email address is confirmed. You can login now" }));
                }

            }
            catch (System.Exception)
            {

                Console.WriteLine("There was an error");
            }

            return BadRequest("Something went wrong!");

        }

        [HttpPost("resend-email-confirmation-link/{email}")]
        public async Task<IActionResult> ResendEmailConformationLink(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid email");

            var user = await userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("This email address has not been registered yet");
            if (user.EmailConfirmed == true) return BadRequest("Your email address was confirmed before. Please login to your account");

            try
            {
                if (await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "Confirmation link sent", message = "Please confirm your email address" }));
                }

                return BadRequest("Failed to send email.");
            }
            catch (System.Exception)
            {

                return BadRequest("Failed to send email");
            }

        }

        [HttpPost("forgot-username-or-password/{email}")]

        public async Task<IActionResult> ForgotUsernameOrPassword(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid email");

            var user = await userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("This email address has not been registered yet");
            if (user.EmailConfirmed == false) return BadRequest("please confirm your email address first");

            try
            {
                if (await SendForgotUsernameOrPasswordEmail(user))
                {
                    return Ok(new JsonResult(new { title = "Forgot username or password email sent", message = "Please check your email" }));
                }

                return BadRequest("Failed to send email.");
            }
            catch (System.Exception)
            {

                return BadRequest("Failed to send email.");
            }
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null) return Unauthorized("This email address has not been registered yet");
            if (user.EmailConfirmed == false) return BadRequest("Please confirm your email address first");

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(resetPasswordDto.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await userManager.ResetPasswordAsync(user, decodedToken, resetPasswordDto.NewPassword);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { title = "Password rest successful", message = "Your email address is confirmed. You can login now" }));
                }

                return BadRequest("Invalid token. Please try again");
            }
            catch (System.Exception)
            {

                return BadRequest("Invalid token. Please try again");
            }
        }

        private async Task<bool> SendForgotUsernameOrPasswordEmail(User user)
        {
            DotNetEnv.Env.Load();
            string reset_password_path = Environment.GetEnvironmentVariable("reset_password_path");
            string application_name = Environment.GetEnvironmentVariable("application_name");

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{config["Jwt:Issuer"]}{reset_password_path}?token={token}&email={user.Email}";

            var body = $"<p>Hello: {user.UserName}</p>" + "<p>In order to reset your password, please click on the following link.</p>" +
                        $"<p><a href=\"{url}\">Click Here</a></p>" +
                        "<p>Thank you</p>" +
                        $"<br>{application_name}";

            var emailSend = new EmailSendDto(user.Email, "Reset username or Password", body);

            return await emailService.SendEmailAsync(emailSend);
        }

    }
}