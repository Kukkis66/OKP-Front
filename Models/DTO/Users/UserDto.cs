using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OKPBackend.Models.DTO.Favorites;

namespace OKPBackend.Models.DTO.Users
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public List<FavoriteDto> Favorites { get; set; }
        public string[] Roles { get; set; }
    }
}