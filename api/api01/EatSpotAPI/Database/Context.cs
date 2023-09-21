using Microsoft.EntityFrameworkCore;
using EatSpotAPI.Models;

namespace EatSpotAPI.Database
{
    public class Context : DbContext
    {
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public Context(DbContextOptions<Context> options) : base(options) { }
    }

}