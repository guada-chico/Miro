using Miro.Models;
using Microsoft.EntityFrameworkCore;

namespace Miro.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Book> Books => Set<Book>();
        public DbSet<Favorite> Favorites => Set<Favorite>();
        public DbSet<ReadingStatus> ReadingStatuses { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Evitar borrado en cascada circular para Friendships
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.UserRequest)
                .WithMany()
                .HasForeignKey(f => f.UserRequestId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.UserReceive)
                .WithMany()
                .HasForeignKey(f => f.UserReceiveId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Data de Libros
            modelBuilder.Entity<Book>().HasData(
                new Book { Id = 1, Title = "El Hobbit", Author = "J.R.R. Tolkien", Category = "Fantasía" },
                new Book { Id = 2, Title = "Neuromante", Author = "William Gibson", Category = "Ciencia Ficción" },
                new Book { Id = 3, Title = "Cien años de soledad", Author = "Gabriel García Márquez", Category = "Realismo Mágico" }
            );
        }
    }
}