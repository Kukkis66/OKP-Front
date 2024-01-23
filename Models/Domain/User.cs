using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OKPBackend.Models.Domain
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(20)]
        [MinLength(2)]
        public string Username { get; set; }

        [EmailAddress]
        [Required]
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
    }
}