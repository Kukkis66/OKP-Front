using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OKPBackend.Data;
using OKPBackend.Models.Domain;
using OKPBackend.Models.DTO.Favorites;

namespace OKPBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly OKPDbContext dbContext;
        private readonly IMapper mapper;

        public FavoritesController(OKPDbContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var favorites = await dbContext.Favorites.ToListAsync();
            return Ok(favorites);

        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddFavoriteDto addFavoriteDto)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == addFavoriteDto.UserId);

            if (user == null)
            {
                return NotFound("User was not found");
            }

            var favorite = mapper.Map<Favorite>(addFavoriteDto);

            var response = await dbContext.Favorites.AddAsync(favorite);
            await dbContext.SaveChangesAsync();

            return Ok("Success");

        }
    }
}