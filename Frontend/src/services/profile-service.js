
import api from './api-config';

/** Obtiene el perfil del usuario autenticado. */
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

/** Actualiza nombre y email. */
export const updateProfile = async (name, email) => {
  const response = await api.put('/profile', { name, email });
  return response.data;
};

/** Cambia la contraseña. */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/profile/password', { currentPassword, newPassword });
  return response.data;
};

/**
 * Sube una nueva foto de perfil.
 * Convierte el File a base64 antes de enviarlo.
 * @param {File} file
 */
export const updateAvatar = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const response = await api.put('/profile/avatar', { avatarBase64: reader.result });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
