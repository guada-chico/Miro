using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Miro.Functions
{
    public class AnalyzeReview
    {
        private readonly ILogger<AnalyzeReview> _logger;

        public AnalyzeReview(ILogger<AnalyzeReview> logger)
        {
            _logger = logger;
        }

        [Function("AnalyzeReview")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            _logger.LogInformation("Iniciando análisis de sentimiento en .NET...");

            // 1. Lectura del cuerpo de la petición
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            // 2. Validación: Si el cuerpo está vacío, evitamos el error de parseo
            if (string.IsNullOrWhiteSpace(requestBody))
            {
                return new BadRequestObjectResult(new { error = "El cuerpo de la petición está vacío." });
            }

            try
            {
                // 3. Deserialización del JSON
                dynamic data = JsonConvert.DeserializeObject(requestBody);
                string reviewText = data?.text;

                if (string.IsNullOrEmpty(reviewText))
                {
                    return new BadRequestObjectResult(new { error = "No se encontró la propiedad 'text' en el JSON." });
                }

                // 4. Motor de Inferencia (Diccionario de Sentimientos)
                string reviewLower = reviewText.ToLower();

                var palabrasPositivas = new List<string> {
                    "increíble", "bueno", "me encanta", "obra maestra", "recomendado",
                    "excelente", "genial", "fantástico", "maravilloso", "top", "recomiendo"
                };

                var palabrasNegativas = new List<string> {
                    "malo", "aburrido", "basura", "mierda", "pésimo", "no recomendable", "no recomiendo",
                    "horroroso", "decepción", "bodrio", "infumable", "terrible"
                };

                // 5. Lógica de clasificación
                string sentiment = "Neutral";

                // Priorizamos la detección de sentimientos negativos para moderación
                if (palabrasNegativas.Any(p => reviewLower.Contains(p)))
                {
                    sentiment = "Negativo";
                }
                else if (palabrasPositivas.Any(p => reviewLower.Contains(p)))
                {
                    sentiment = "Positivo";
                }

                // 6. Respuesta al cliente
                _logger.LogInformation($"Análisis finalizado. Sentimiento detectado: {sentiment}");

                return new OkObjectResult(new
                {
                    message = "Análisis completado exitosamente",
                    sentiment = sentiment,
                    length = reviewText.Length,
                    processedAt = System.DateTime.UtcNow
                });
            }
            catch (JsonReaderException)
            {
                // Captura errores si el JSON enviado desde Postman/React está mal formado
                return new BadRequestObjectResult(new { error = "El formato del JSON es inválido." });
            }
        }
    }
}