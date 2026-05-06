using Microsoft.AspNetCore.Mvc;
using Miro.Services.Interfaces;

namespace Miro.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExternalBooksController : ControllerBase
    {
        private readonly IGoogleBookService _googleService;

        public ExternalBooksController(IGoogleBookService googleService)
        {
            _googleService = googleService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("La consulta de búsqueda no puede estar vacía.");

            try
            {
                var results = await _googleService.SearchBooksAsync(q);
                return Ok(results);
            }
            catch (Exception ex)
            {
                // Esto te ayudará a ver el error real en la respuesta
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }
    }
}