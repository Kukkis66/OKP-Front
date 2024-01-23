using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OKPBackend.Models.DTO.Favorites
{
    public class AddFavoriteDto
    {
        public Guid Key { get; set; }
        public Guid UserId { get; set; }
    }
}