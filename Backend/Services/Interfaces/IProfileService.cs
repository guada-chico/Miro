
using Miro.Models;

namespace Miro.Services.Interfaces
{
    public class UpdateProfileRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class UpdateAvatarRequest
    {
        /// <summary>Imagen en formato base64 (data:image/jpeg;base64,...)</summary>
        public string AvatarBase64 { get; set; } = string.Empty;
    }

    public interface IProfileService
    {
        Task<User?> GetProfileAsync(int userId);
        Task<(bool Success, string Error)> UpdateProfileAsync(int userId, UpdateProfileRequest request);
        Task<(bool Success, string Error)> ChangePasswordAsync(int userId, ChangePasswordRequest request);
        Task<(bool Success, string Error)> UpdateAvatarAsync(int userId, string avatarBase64);
        Task<(bool Success, string Error)> DeleteAvatarAsync(int userId);
    }
}
