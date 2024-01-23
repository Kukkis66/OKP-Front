using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OKPBackend.Data;
using OKPBackend.Models.DTO.Favorites;

namespace OKPBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly OKPDbContext dbContext;

        public FavoritesController(OKPDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var favorites = await dbContext.Favorites.ToListAsync();
            return Ok(favorites);

        }

        // [HttpPost]
        // public async Task<IActionResult> Post([FromBody] AddFavoriteDto addFavoriteDto)
        // {

        //     var response = await dbContext.Favorites.AddAsync()
        //     return Ok(favorites);

        // }
    }
}