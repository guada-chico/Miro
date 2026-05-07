namespace Miro.Services.Interfaces
{
    public class GutendexBook
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Authors { get; set; } = new();
        public string? CoverUrl { get; set; }
        public string? ReadUrl { get; set; }   // URL directa para leer (.txt o .html)
        public List<string> Languages { get; set; } = new();
        public int DownloadCount { get; set; }
    }

    public interface IGutendexService
    {
        /// <summary>
        /// Busca libros gratuitos en el catálogo de Project Gutenberg.
        /// </summary>
        Task<IEnumerable<GutendexBook>> SearchBooksAsync(string query);

        /// <summary>
        /// Obtiene los libros más descargados (para la sección de clásicos).
        /// </summary>
        Task<IEnumerable<GutendexBook>> GetTopBooksAsync(int count = 20);
    }
}
