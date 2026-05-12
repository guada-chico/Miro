
using Miro.Services.Interfaces;
using System.Text.Json;

namespace Miro.Services
{
    public class OpenLibrarySearchService : IOpenLibrarySearchService
    {
        private readonly HttpClient _httpClient;
        private const string SearchUrl = "https://openlibrary.org/search.json";
        private const string DetailUrl = "https://openlibrary.org/api/books";
        private const string GoogleUrl = "https://www.googleapis.com/books/v1/volumes";
        private const string Fields    = "title,author_name,cover_i,isbn,subject,first_publish_year";

        public OpenLibrarySearchService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<OpenLibraryBook>> GetSpanishRecommendationsAsync(
            string genre = "novela", int limit = 20)
        {
            var q   = Uri.EscapeDataString(genre);
            var url = $"{SearchUrl}?q={q}&language=spa&sort=new&limit={limit}&fields={Fields}";
            var books = await FetchAsync(url);
            await EnrichWithDetailsAsync(books);
            return books;
        }

        public async Task<IEnumerable<OpenLibraryBook>> SearchSpanishAsync(
            string query, int limit = 20)
        {
            var q   = Uri.EscapeDataString(query);
            var url = $"{SearchUrl}?q={q}&language=spa&sort=new&limit={limit}&fields={Fields}";
            var books = await FetchAsync(url);
            await EnrichWithDetailsAsync(books);
            return books;
        }

        private async Task<List<OpenLibraryBook>> FetchAsync(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode) return new List<OpenLibraryBook>();

                var content = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);

                if (!doc.RootElement.TryGetProperty("docs", out var docs))
                    return new List<OpenLibraryBook>();

                var books = new List<OpenLibraryBook>();

                foreach (var item in docs.EnumerateArray())
                {
                    var title = item.TryGetProperty("title", out var t) ? t.GetString() : null;
                    if (string.IsNullOrWhiteSpace(title)) continue;

                    var author = "Autor desconocido";
                    if (item.TryGetProperty("author_name", out var authors) && authors.GetArrayLength() > 0)
                        author = authors[0].GetString() ?? author;

                    string? coverM = null, coverL = null;
                    if (item.TryGetProperty("cover_i", out var coverId))
                    {
                        var id = coverId.GetInt32();
                        coverM = $"https://covers.openlibrary.org/b/id/{id}-M.jpg";
                        coverL = $"https://covers.openlibrary.org/b/id/{id}-L.jpg";
                    }

                    string? isbn = null;
                    if (item.TryGetProperty("isbn", out var isbns) && isbns.GetArrayLength() > 0)
                        isbn = isbns[0].GetString();

                    int? year = null;
                    if (item.TryGetProperty("first_publish_year", out var yr))
                        year = yr.GetInt32();

                    string? subject = null;
                    if (item.TryGetProperty("subject", out var subjects) && subjects.GetArrayLength() > 0)
                        subject = subjects[0].GetString();

                    books.Add(new OpenLibraryBook
                    {
                        Title            = title,
                        Author           = author,
                        CoverUrl         = coverM,
                        CoverUrlLarge    = coverL,
                        Isbn             = isbn,
                        FirstPublishYear = year,
                        Subject          = subject
                    });
                }

                return books;
            }
            catch
            {
                return new List<OpenLibraryBook>();
            }
        }

        // Enriquece con portada L y excerpt (primera frase) desde el endpoint de detalle
        private async Task EnrichWithDetailsAsync(List<OpenLibraryBook> books)
        {
            var toEnrich = books.Where(b => !string.IsNullOrEmpty(b.Isbn)).Take(20).ToList();
            var semaphore = new SemaphoreSlim(5);

            var tasks = toEnrich.Select(async book =>
            {
                await semaphore.WaitAsync();
                try
                {
                    var url      = $"{DetailUrl}?bibkeys=ISBN:{book.Isbn}&format=json&jscmd=data";
                    var response = await _httpClient.GetAsync(url);
                    if (!response.IsSuccessStatusCode) return;

                    var content = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(content);

                    var key = $"ISBN:{book.Isbn}";
                    if (!doc.RootElement.TryGetProperty(key, out var detail)) return;

                    // Portada en tamaño L
                    if (detail.TryGetProperty("cover", out var cover))
                    {
                        if (cover.TryGetProperty("large", out var large))
                            book.CoverUrlLarge = large.GetString();
                        // Si la búsqueda no tenía portada M, usamos la del detalle
                        if (book.CoverUrl == null && cover.TryGetProperty("medium", out var med))
                            book.CoverUrl = med.GetString();
                    }

                    // Excerpt como descripción (primera frase del libro)
                    if (detail.TryGetProperty("excerpts", out var excerpts) && excerpts.GetArrayLength() > 0)
                    {
                        var first = excerpts[0];
                        if (first.TryGetProperty("text", out var text))
                            book.Description = text.GetString();
                    }

                    // Si no hay excerpt, buscar sinopsis en Google Books por título+autor
                    if (string.IsNullOrEmpty(book.Description))
                    {
                        try
                        {
                            // Buscar por título y autor (más fiable que ISBN-10 convertido)
                            var titleQuery = Uri.EscapeDataString($"{book.Title} {book.Author}");
                            var gUrl = $"{GoogleUrl}?q={titleQuery}&langRestrict=es&maxResults=1&fields=items(volumeInfo(description))";
                            var gResp = await _httpClient.GetAsync(gUrl);
                            if (gResp.IsSuccessStatusCode)
                            {
                                var gContent = await gResp.Content.ReadAsStringAsync();
                                using var gDoc = JsonDocument.Parse(gContent);
                                if (gDoc.RootElement.TryGetProperty("items", out var gItems) &&
                                    gItems.GetArrayLength() > 0 &&
                                    gItems[0].TryGetProperty("volumeInfo", out var vInfo) &&
                                    vInfo.TryGetProperty("description", out var desc))
                                {
                                    book.Description = desc.GetString();
                                }
                            }
                        }
                        catch { /* silencioso */ }
                    }

                    // Editorial
                    if (detail.TryGetProperty("publishers", out var pubs) && pubs.GetArrayLength() > 0)
                    {
                        var pub = pubs[0];
                        if (pub.TryGetProperty("name", out var pubName))
                            book.Publisher = pubName.GetString();
                    }
                }
                catch { /* silencioso */ }
                finally { semaphore.Release(); }
            });

            await Task.WhenAll(tasks);
        }
    }
}
