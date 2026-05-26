using Miro.Data;
using Miro.Models;
using Miro.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Miro.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly AppDbContext _context;
        private readonly IPrhBooksService _prhService;

        public RecommendationService(AppDbContext context, IPrhBooksService prhService)
        {
            _context = context;
            _prhService = prhService;
        }

        public async Task<IEnumerable<Book>> GetRecommendationsAsync(int userId)
        {
            // 1. Obtener los IDs de los libros que ya le gustan al usuario
            var favoriteBookIds = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Select(f => f.BookId)
                .ToListAsync();

            // 2. Obtener los títulos/autores de esos libros para evitar duplicados
            var favoriteTitles = await _context.Books
                .Where(b => favoriteBookIds.Contains(b.Id))
                .Select(b => new { b.Title, b.Author })
                .ToListAsync();

            var existingKeys = new HashSet<string>(favoriteTitles
                .Select(x => (x.Title + "|" + x.Author).ToLowerInvariant()));

            // 3. Obtener los géneros favoritos para orientar la búsqueda en PRH
            var favoriteGenres = await _context.Books
                .Where(b => favoriteBookIds.Contains(b.Id))
                .Select(b => b.Category)
                .Where(c => !string.IsNullOrEmpty(c))
                .Distinct()
                .ToListAsync();

            var results = new List<Book>();

            // Si no hay géneros, devolvemos novedades de PRH como fallback
            if (!favoriteGenres.Any())
            {
                var newReleases = await _prhService.GetNewReleasesAsync(5);
                foreach (var p in newReleases.Take(5))
                {
                    var key = (p.Title + "|" + p.Author).ToLowerInvariant();
                    if (existingKeys.Contains(key)) continue;
                    results.Add(new Book
                    {
                        Title = p.Title,
                        Author = p.Author,
                        Isbn = p.Isbn,
                        Synopsis = p.Description,
                        ImageUrl = p.CoverUrl,
                        Category = p.Category
                    });
                }

                return results;
            }

            // Buscar en PRH por cada género favorito (limitado a 3 géneros para no saturar)
            foreach (var genre in favoriteGenres.Take(3))
            {
                try
                {
                    var prhBooks = await _prhService.SearchAsync(genre, 10);
                    foreach (var p in prhBooks)
                    {
                        var key = (p.Title + "|" + p.Author).ToLowerInvariant();
                        if (existingKeys.Contains(key)) continue;
                        if (results.Any(r => (r.Title + "|" + r.Author).ToLowerInvariant() == key)) continue;

                        results.Add(new Book
                        {
                            Title = p.Title,
                            Author = p.Author,
                            Isbn = p.Isbn,
                            Synopsis = p.Description,
                            ImageUrl = p.CoverUrl,
                            Category = p.Category
                        });

                        if (results.Count >= 5) break;
                    }
                }
                catch
                {
                    // Ignorar errores puntuales de PRH y seguir con el siguiente género
                }

                if (results.Count >= 5) break;
            }

            // Si no hemos recopilado suficientes, completar con novedades
            if (results.Count < 5)
            {
                var extras = await _prhService.GetNewReleasesAsync(10);
                foreach (var p in extras)
                {
                    if (results.Count >= 5) break;
                    var key = (p.Title + "|" + p.Author).ToLowerInvariant();
                    if (existingKeys.Contains(key)) continue;
                    if (results.Any(r => (r.Title + "|" + r.Author).ToLowerInvariant() == key)) continue;

                    results.Add(new Book
                    {
                        Title = p.Title,
                        Author = p.Author,
                        Isbn = p.Isbn,
                        Synopsis = p.Description,
                        ImageUrl = p.CoverUrl,
                        Category = p.Category
                    });
                }
            }

            return results.Take(5);
        }
    }
}