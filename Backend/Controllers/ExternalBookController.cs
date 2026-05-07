using Microsoft.AspNetCore.Mvc;
using Miro.Services.Interfaces;

namespace Miro.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExternalBooksController : ControllerBase
    {
        private readonly IGoogleBookService _googleService;
        private readonly IOpenLibraryService _openLibraryService;

        // Inyectamos ambos servicios
        public ExternalBooksController(IGoogleBookService googleService, IOpenLibraryService openLibraryService)
        {
            _googleService = googleService;
            _openLibraryService = openLibraryService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            // 1. Validación básica
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("La consulta de búsqueda no puede estar vacía.");

            try
            {
                // 2. Buscamos en Google Books (trae títulos, autores, sinopsis e ISBN)
                var results = await _googleService.SearchBooksAsync(q);
                var booksList = results.ToList();

                // 3. Refuerzo de portadas con Open Library
                foreach (var book in booksList)
                {
                    // Si Google no nos dio imagen, o si queremos intentar buscar una de mejor calidad
                    // Usamos el ISBN que acabamos de implementar
                    if (string.IsNullOrEmpty(book.ImageUrl) && !string.IsNullOrEmpty(book.Isbn))
                    {
                        var highResCover = await _openLibraryService.GetHighResCoverUrlAsync(book.Isbn);

                        if (!string.IsNullOrEmpty(highResCover))
                        {
                            book.ImageUrl = highResCover;
                        }
                    }
                }

                return Ok(booksList);
            }
            catch (Exception ex)
            {
                // Log del error (opcional) y respuesta 500
                return StatusCode(500, $"Error al procesar la búsqueda externa: {ex.Message}");
            }
        }
    }
}