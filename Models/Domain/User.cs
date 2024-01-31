using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace OKPBackend.Models.Domain
{
    public class User : IdentityUser
    {

        // [Required]
        // [MaxLength(20)]
        // [MinLength(2)]
        // public string Username { get; set; }

        // [EmailAddress]
        // [Required]
        // public string Email { get; set; }
        // public string PasswordHash { get; set; }
        // public string[] Roles { get; set; }

        public List<Favorite> Favorites { get; set; }
    }
}