using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OKPBackend.Models.DTO.Users;

namespace OKPBackend.Models.DTO.Favorites
{
    public class FavoriteDto
    {
        public Guid Id { get; set; }
        public string Key { get; set; }
        public string UserId { get; set; }
        public UserDto User { get; set; }
    }
}