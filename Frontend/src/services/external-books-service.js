import api from './api-config';

// ─────────────────────────────────────────────
//  GOOGLE BOOKS + OPEN LIBRARY (via backend)
// ─────────────────────────────────────────────

/**
 * Busca libros usando Google Books con portadas reforzadas por Open Library.
 * El backend combina ambas APIs automáticamente.
 * @param {string} query - Texto de búsqueda
 * @returns {Array} Lista de libros con título, autor, ISBN, sinopsis, portada
 */
export const searchExternalBooks = async (query) => {
  const response = await api.get('/externalbooks/search', { params: { q: query } });
  return response.data;
};

/**
 * Construye la URL de portada de Open Library a partir de un ISBN.
 * No necesita llamada al backend, es una URL directa.
 * @param {string} isbn
 * @param {'S'|'M'|'L'} size - S=pequeña, M=mediana, L=grande
 */
export const getOpenLibraryCover = (isbn, size = 'M') => {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
};

// ─────────────────────────────────────────────
//  GUTENDEX (Project Gutenberg - libros gratis)
// ─────────────────────────────────────────────

/**
 * Busca libros gratuitos en Project Gutenberg.
 * @param {string} query
 * @returns {Array} Lista de libros con título, autores, portada y URL de lectura
 */
export const searchGutendexBooks = async (query) => {
  const response = await api.get('/gutendex/search', { params: { q: query } });
  return response.data;
};

/**
 * Obtiene los libros clásicos más populares de Gutenberg.
 * @param {number} count - Número de libros a obtener (máx 20)
 */
export const getTopClassics = async (count = 20) => {
  const response = await api.get('/gutendex/top', { params: { count } });
  return response.data;
};
