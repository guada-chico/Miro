using Miro.Models;
using Miro.Services.Interfaces;
using System.Text.Json;

namespace Miro.Services
{
    public class GoogleBookService : IGoogleBookService
    {
        private readonly HttpClient _httpClient;

        public GoogleBookService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Book>> SearchBooksAsync(string query)
        {
            var response = await _httpClient.GetAsync($"https://www.googleapis.com/books/v1/volumes?q={Uri.EscapeDataString(query)}&maxResults=10");

            if (!response.IsSuccessStatusCode) return new List<Book>();

            var content = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(content);
            var books = new List<Book>();

            if (doc.RootElement.TryGetProperty("items", out var items))
            {
                foreach (var item in items.EnumerateArray())
                {
                    var info = item.GetProperty("volumeInfo");

                    books.Add(new Book
                    {
                        Title = info.TryGetProperty("title", out var t) ? t.GetString() ?? "Sin título" : "Sin título",
                        Author = info.TryGetProperty("authors", out var a) && a.GetArrayLength() > 0 ? a[0].GetString() ?? "Autor desconocido" : "Autor desconocido",
                        Synopsis = info.TryGetProperty("description", out var d) ? d.GetString() ?? "Sin sinopsis" : "Sin sinopsis",
                        TotalPages = info.TryGetProperty("pageCount", out var p) ? p.GetInt32() : 0,
                        Category = info.TryGetProperty("categories", out var c) && c.GetArrayLength() > 0 ? c[0].GetString() ?? "General" : "General",
                        ImageUrl = info.TryGetProperty("imageLinks", out var imgs) && imgs.TryGetProperty("thumbnail", out var thumb)
                                   ? thumb.GetString()?.Replace("http://", "https://") // Forzamos HTTPS para las portadas
                                   : null
                    });
                }
            }
            return books;
        }
    }
}