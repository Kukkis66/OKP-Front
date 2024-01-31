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

namespace OKPBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly OKPDbContext dbContext;
        private readonly IMapper mapper;

        public UsersController(OKPDbContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await dbContext.Users.Include(x => x.Favorites).ToListAsync();

            return Ok(mapper.Map<List<UserDto>>(users));
        }
    }
}