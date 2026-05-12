namespace Miro.Services.Interfaces
{
    public class GutendexBook
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Authors { get; set; } = new();
        public string? CoverUrl { get; set; }
        public string? ReadUrl { get; set; }
        public List<string> Languages { get; set; } = new();
        public int DownloadCount { get; set; }
    }

    public interface IGutendexService
    {
        /// <summary>Busca libros gratuitos (todos los idiomas).</summary>
        Task<IEnumerable<GutendexBook>> SearchBooksAsync(string query);

        /// <summary>Top libros más descargados (todos los idiomas).</summary>
        Task<IEnumerable<GutendexBook>> GetTopBooksAsync(int count = 20);

        /// <summary>Clásicos en español ordenados por popularidad.</summary>
        Task<IEnumerable<GutendexBook>> GetSpanishBooksAsync(int count = 32);

        /// <summary>Busca libros en español por texto.</summary>
        Task<IEnumerable<GutendexBook>> SearchSpanishBooksAsync(string query);
    }
}
