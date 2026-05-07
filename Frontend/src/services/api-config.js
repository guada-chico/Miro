import axios from 'axios';

// URL del backend .NET (puerto HTTPS del perfil "https" en launchSettings.json)
const API_URL = 'https://localhost:7072/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getValidToken = () => {
  return localStorage.getItem('token');
};

// Adjunta el token JWT en cada petición si existe
api.interceptors.request.use((config) => {
  const token = getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirige al login si el backend devuelve 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;