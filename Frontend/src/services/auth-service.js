import api from './api-config';

/**
 * Inicia sesión y guarda el token en localStorage.
 * @returns {string} El token JWT
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return token;
};

/**
 * Registra un nuevo usuario.
 */
export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Cierra sesión eliminando el token.
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Devuelve true si hay un token guardado.
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Decodifica el payload del JWT y devuelve el nombre del usuario.
 * No necesita llamada al backend — el nombre está en el propio token.
 */
export const getUserName = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // El payload es la segunda parte del JWT, codificada en base64
    const payload = JSON.parse(atob(token.split('.')[1]));

    // ASP.NET serializa ClaimTypes.Name con esta clave larga
    const nameKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
    return payload[nameKey] || payload['name'] || payload['unique_name'] || null;
  } catch {
    return null;
  }
};
