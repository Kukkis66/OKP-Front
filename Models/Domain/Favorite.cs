using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OKPBackend.Models.Domain
{
    public class Favorite
    {
        public Guid Id { get; set; }
        public Guid Key { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}