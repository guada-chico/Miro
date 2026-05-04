import api from './api-config';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    // Agregamos 'cause' para que ESLint esté contento y no perdamos el rastro del error
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión', { cause: error });
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    // Lo mismo aquí para el registro
    throw new Error(error.response?.data?.message || 'Error en el registro', { cause: error });
  }
};