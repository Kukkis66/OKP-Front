using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OKPBackend.Models.Domain;

namespace OKPBackend.Data
{
    public class OKPDbContext : DbContext
    {
        public OKPDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<User> Users { get; set; }

        public DbSet<Favorite> Favorites { get; set; }
    }
}