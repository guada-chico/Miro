
namespace Miro.Services.Interfaces
{
    public class OpenLibraryBook
    {
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? CoverUrl { get; set; }       // tamaño M por defecto, L si se enriquece
        public string? CoverUrlLarge { get; set; }  // tamaño L (para el modal)
        public string? Isbn { get; set; }
        public int? FirstPublishYear { get; set; }
        public string? Subject { get; set; }
        public string? Description { get; set; }    // excerpt o sinopsis si está disponible
        public string? Publisher { get; set; }
    }

    public interface IOpenLibrarySearchService
    {
        /// <summary>Libros en español ordenados por novedad.</summary>
        Task<IEnumerable<OpenLibraryBook>> GetSpanishRecommendationsAsync(string genre = "novela", int limit = 20);

        /// <summary>Búsqueda libre en español.</summary>
        Task<IEnumerable<OpenLibraryBook>> SearchSpanishAsync(string query, int limit = 20);
    }
}
