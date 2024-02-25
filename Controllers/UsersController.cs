using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OKPBackend.Data;
using OKPBackend.Models.DTO.Users;
using OKPBackend.Services;

namespace OKPBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly OKPDbContext dbContext;
        private readonly IMapper mapper;
        private readonly EmailService emailService;

        public UsersController(OKPDbContext dbContext, IMapper mapper, EmailService emailService)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await dbContext.Users.Include(x => x.Favorites).ToListAsync();

            return Ok(mapper.Map<List<UserDto>>(users));
        }

        [HttpDelete]
        [Route("id")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                return BadRequest("Invalid id");
            }

            dbContext.Users.Remove(user);
            await dbContext.SaveChangesAsync();

            return Ok("User was deleted");
        }



    }
}