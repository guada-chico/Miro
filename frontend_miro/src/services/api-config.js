import axios from 'axios';

// 1. La URL del backend de tu compañera (ajustala cuando ella te la de)
const API_URL = 'https://localhost:7000/api'; 

const api = axios.create({
  baseURL: API_URL,
});

// 2. Función para obtener el token guardado
export const getValidToken = () => {
  return localStorage.getItem('token');
};

// 3. Interceptor: Esto añade el token a todas tus peticiones automáticamente
api.interceptors.request.use((config) => {
  const token = getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;