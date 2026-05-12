using Microsoft.AspNetCore.Mvc;
using Miro.Services.Interfaces;

namespace Miro.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GutendexController : ControllerBase
    {
        private readonly IGutendexService _gutendexService;

        public GutendexController(IGutendexService gutendexService)
        {
            _gutendexService = gutendexService;
        }

        /// <summary>Busca libros gratuitos (todos los idiomas).</summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("La consulta no puede estar vacía.");
            var results = await _gutendexService.SearchBooksAsync(q);
            return Ok(results);
        }

        /// <summary>Top libros más descargados (todos los idiomas).</summary>
        [HttpGet("top")]
        public async Task<IActionResult> GetTop([FromQuery] int count = 20)
        {
            var results = await _gutendexService.GetTopBooksAsync(count);
            return Ok(results);
        }

        /// <summary>Clásicos en español ordenados por popularidad.</summary>
        [HttpGet("spanish")]
        public async Task<IActionResult> GetSpanish([FromQuery] int count = 32)
        {
            var results = await _gutendexService.GetSpanishBooksAsync(count);
            return Ok(results);
        }

        /// <summary>Busca libros en español por texto.</summary>
        [HttpGet("spanish/search")]
        public async Task<IActionResult> SearchSpanish([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("La consulta no puede estar vacía.");
            var results = await _gutendexService.SearchSpanishBooksAsync(q);
            return Ok(results);
        }
    }
}
