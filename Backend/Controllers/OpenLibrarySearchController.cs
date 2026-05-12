
using Microsoft.AspNetCore.Mvc;
using Miro.Services.Interfaces;

namespace Miro.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OpenLibrarySearchController : ControllerBase
    {
        private readonly IOpenLibrarySearchService _olService;

        public OpenLibrarySearchController(IOpenLibrarySearchService olService)
        {
            _olService = olService;
        }

        /// <summary>Libros en español por género, ordenados por novedad.</summary>
        [HttpGet("recommendations")]
        public async Task<IActionResult> GetRecommendations(
            [FromQuery] string genre = "novela",
            [FromQuery] int limit = 20)
        {
            var books = await _olService.GetSpanishRecommendationsAsync(genre, limit);
            return Ok(books.ToList());
        }

        /// <summary>Búsqueda libre en español.</summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string q,
            [FromQuery] int limit = 20)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("El parámetro 'q' es obligatorio.");

            var books = await _olService.SearchSpanishAsync(q, limit);
            return Ok(books.ToList());
        }
    }
}
