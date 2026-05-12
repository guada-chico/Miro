import api from './api-config';

// ─────────────────────────────────────────────
//  GOOGLE BOOKS (todo en español)
// ─────────────────────────────────────────────

/**
 * Búsqueda libre de libros (filtra por español).
 */
export const searchExternalBooks = async (query) => {
  const response = await api.get('/externalbooks/search', { params: { q: query } });
  return response.data;
};

/**
 * Libros actuales en español por género.
 * Géneros: novela, thriller, romance, 'ciencia ficcion', fantasia,
 *          historia, biografia, autoayuda, infantil
 */
export const getSpanishRecommendations = async (genre = 'novela') => {
  const response = await api.get('/externalbooks/recommendations', { params: { genre } });
  return response.data;
};

/**
 * Clásicos de la literatura en español.
 */
export const getSpanishClassics = async () => {
  const response = await api.get('/externalbooks/classics');
  return response.data;
};

// ─────────────────────────────────────────────
//  OPEN LIBRARY — portadas directas por ISBN
// ─────────────────────────────────────────────

export const getOpenLibraryCover = (isbn, size = 'M') => {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
};

// ─────────────────────────────────────────────
//  GUTENDEX (clásicos gratuitos para leer)
// ─────────────────────────────────────────────

export const searchGutendexBooks = async (query) => {
  const response = await api.get('/gutendex/search', { params: { q: query } });
  return response.data;
};

export const getTopClassics = async (count = 20) => {
  const response = await api.get('/gutendex/top', { params: { count } });
  return response.data;
};
