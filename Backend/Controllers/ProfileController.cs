
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Miro.Services.Interfaces;
using System.Security.Claims;

namespace Miro.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>Obtiene el perfil del usuario autenticado.</summary>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _profileService.GetProfileAsync(GetUserId());
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.AvatarUrl
            });
        }

        /// <summary>Actualiza nombre y email.</summary>
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("El nombre y el correo son obligatorios.");

            var (success, error) = await _profileService.UpdateProfileAsync(GetUserId(), request);
            if (!success) return BadRequest(error);

            return Ok(new { message = "Perfil actualizado correctamente." });
        }

        /// <summary>Cambia la contraseña.</summary>
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var (success, error) = await _profileService.ChangePasswordAsync(GetUserId(), request);
            if (!success) return BadRequest(error);

            return Ok(new { message = "Contraseña actualizada correctamente." });
        }

        /// <summary>Actualiza la foto de perfil (base64).</summary>
        [HttpPut("avatar")]
        public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarRequest request)
        {
            var (success, error) = await _profileService.UpdateAvatarAsync(GetUserId(), request.AvatarBase64);
            if (!success) return BadRequest(error);

            return Ok(new { message = "Foto actualizada correctamente." });
        }
    }
}
