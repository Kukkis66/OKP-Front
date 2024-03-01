using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OKPBackend.Models.DTO.Users
{
    public class LoginResponseDto
    {
        public string JwtToken { get; set; }
    }
}