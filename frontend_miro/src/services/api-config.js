import axios from 'axios';

// URL temporal del backend de .NET
const API_URL = 'https://localhost:7000/api'; 

const api = axios.create({
  baseURL: API_URL,
});

export const getValidToken = () => {
  return localStorage.getItem('token');
};

api.interceptors.request.use((config) => {
  const token = getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;