using Miro.Data;
using Miro.Models;
using Miro.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Miro.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly AppDbContext _context;

        public RecommendationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetRecommendationsAsync(int userId)
        {
            // 1. Obtener los IDs de los libros que ya le gustan al usuario
            var favoriteBookIds = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Select(f => f.BookId)
                .ToListAsync();

            // 2. Obtener los géneros de esos libros
            var favoriteGenres = await _context.Books
                .Where(b => favoriteBookIds.Contains(b.Id))
                .Select(b => b.Category)
                .Distinct()
                .ToListAsync();

            // 3. Recomendar libros del mismo género que NO estén ya en sus favoritos
            return await _context.Books
                .Where(b => favoriteGenres.Contains(b.Category) && !favoriteBookIds.Contains(b.Id))
                .Take(5) // Limitamos a 5 recomendaciones
                .ToListAsync();
        }
    }
}