import api from './api-config';

// ─────────────────────────────────────────────
//  OPEN LIBRARY SEARCH — recomendaciones en español
// ─────────────────────────────────────────────

/**
 * Libros en español por género, ordenados por novedad (Open Library).
 * Géneros: novela, thriller, romance, fantasia, historia, biografia, autoayuda
 */
export const getOpenLibraryRecommendations = async (genre = 'novela', limit = 20) => {
  const response = await api.get('/openlibrarysearch/recommendations', { params: { genre, limit } });
  return response.data;
};

/**
 * Búsqueda libre en español (Open Library).
 */
export const searchOpenLibrary = async (query, limit = 20) => {
  const response = await api.get('/openlibrarysearch/search', { params: { q: query, limit } });
  return response.data;
};

// ─────────────────────────────────────────────
//  GUTENDEX — clásicos gratuitos
// ─────────────────────────────────────────────

/**
 * Clásicos en español de Project Gutenberg, ordenados por popularidad.
 */
export const getSpanishClassicsGutenberg = async (count = 32) => {
  const response = await api.get('/gutendex/spanish', { params: { count } });
  return response.data;
};

/**
 * Busca clásicos en español por texto.
 */
export const searchSpanishClassics = async (query) => {
  const response = await api.get('/gutendex/spanish/search', { params: { q: query } });
  return response.data;
};

/**
 * Top libros más descargados de Gutenberg (todos los idiomas).
 */
export const getTopClassics = async (count = 20) => {
  const response = await api.get('/gutendex/top', { params: { count } });
  return response.data;
};

// ─────────────────────────────────────────────
//  GOOGLE BOOKS — búsqueda general en español
// ─────────────────────────────────────────────

export const searchExternalBooks = async (query) => {
  const response = await api.get('/externalbooks/search', { params: { q: query } });
  return response.data;
};

// Mantenemos estas por compatibilidad con otras páginas
export const getSpanishRecommendations = getOpenLibraryRecommendations;
export const getSpanishClassics = getSpanishClassicsGutenberg;

// ─────────────────────────────────────────────
//  PENGUIN RANDOM HOUSE (cuando la key esté activa)
// ─────────────────────────────────────────────

export const getPrhNewReleases = async (rows = 20) => {
  const response = await api.get('/prhbooks/new-releases', { params: { rows } });
  return response.data;
};

export const getPrhComingSoon = async (rows = 20) => {
  const response = await api.get('/prhbooks/coming-soon', { params: { rows } });
  return response.data;
};

export const searchPrhBooks = async (query, rows = 20) => {
  const response = await api.get('/prhbooks/search', { params: { q: query, rows } });
  return response.data;
};

export const checkPrhStatus = async () => {
  const response = await api.get('/prhbooks/status');
  return response.data;
};

// ─────────────────────────────────────────────
//  OPEN LIBRARY — portadas directas por ISBN
// ─────────────────────────────────────────────

export const getOpenLibraryCover = (isbn, size = 'M') => {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
};

// Gutendex búsqueda general (por compatibilidad)
export const searchGutendexBooks = async (query) => {
  const response = await api.get('/gutendex/search', { params: { q: query } });
  return response.data;
};
