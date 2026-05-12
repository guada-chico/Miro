
using Miro.Data;
using Miro.Models;
using Miro.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Miro.Services
{
    public class ProfileService : IProfileService
    {
        private readonly AppDbContext _context;

        public ProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetProfileAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<(bool Success, string Error)> UpdateProfileAsync(int userId, UpdateProfileRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return (false, "Usuario no encontrado.");

            // Verificar que el email no esté en uso por otro usuario
            if (!string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase))
            {
                var emailTaken = await _context.Users
                    .AnyAsync(u => u.Email == request.Email && u.Id != userId);
                if (emailTaken) return (false, "Ese correo ya está en uso por otra cuenta.");
            }

            user.Name  = request.Name.Trim();
            user.Email = request.Email.Trim().ToLower();
            await _context.SaveChangesAsync();
            return (true, string.Empty);
        }

        public async Task<(bool Success, string Error)> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return (false, "Usuario no encontrado.");

            // Verificar contraseña actual
            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                return (false, "La contraseña actual es incorrecta.");

            // Validar nueva contraseña (mismas reglas que el registro)
            if (request.NewPassword.Length < 8)
                return (false, "La nueva contraseña debe tener al menos 8 caracteres.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();
            return (true, string.Empty);
        }

        public async Task<(bool Success, string Error)> UpdateAvatarAsync(int userId, string avatarBase64)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return (false, "Usuario no encontrado.");

            if (string.IsNullOrWhiteSpace(avatarBase64))
                return (false, "La imagen no puede estar vacía.");

            // Validar que sea un data URL de imagen válido
            if (!avatarBase64.StartsWith("data:image/"))
                return (false, "Formato de imagen no válido.");

            user.AvatarUrl = avatarBase64;
            await _context.SaveChangesAsync();
            return (true, string.Empty);
        }
    }
}
