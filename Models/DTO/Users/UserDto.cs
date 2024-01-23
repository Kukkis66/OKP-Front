using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OKPBackend.Models.DTO.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
    }
}