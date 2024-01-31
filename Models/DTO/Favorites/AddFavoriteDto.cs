using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OKPBackend.Models.DTO.Favorites
{
    public class AddFavoriteDto
    {
        public string Key { get; set; }
        public string UserId { get; set; }
    }
}