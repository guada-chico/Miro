using Miro.Models;

namespace Miro.Services.Interfaces
{
    public interface IRecommendationService
    {
        // Obtiene libros recomendados basados en los favoritos del usuario
        Task<IEnumerable<Book>> GetRecommendationsAsync(int userId);
    }
}
