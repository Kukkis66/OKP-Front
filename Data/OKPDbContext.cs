using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OKPBackend.Models.Domain;

namespace OKPBackend.Data
{
    public class OKPDbContext : IdentityDbContext<User>
    {
        public OKPDbContext(DbContextOptions<OKPDbContext> dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<User> Users { get; set; }

        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var readerId = "f2172843-0f6f-4779-b38a-45a3e1dd27c7";
            var writerId = "51e9b872-df58-49ec-bbf1-ba4e31a4f9e6";

            var roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = readerId,
                    ConcurrencyStamp = readerId,
                    Name = "Reader",
                    NormalizedName = "Reader".ToUpper()
                },
                new IdentityRole
                {
                    Id = writerId,
                    ConcurrencyStamp = writerId,
                    Name = "Writer",
                    NormalizedName = "Writer".ToUpper()
                }
            };

            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}