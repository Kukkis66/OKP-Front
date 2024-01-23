using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OKPBackend.Models.DTO.Users;
using OKPBackend.Repositories.Users;

namespace OKPBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly IUsersRepository usersRepository;

        private readonly IMapper mapper;
        public RegisterController(IConfiguration config, IUsersRepository usersRepository, IMapper mapper)
        {
            this.mapper = mapper;
            this.usersRepository = usersRepository;
            this.config = config;

        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
        {
            if (ModelState.IsValid)
            {
                var newUser = await usersRepository.CreateAsync(userRegisterDto);
                return Ok(mapper.Map<UserDto>(newUser));
            }

            return BadRequest("Something went wrong");
        }
    }
}