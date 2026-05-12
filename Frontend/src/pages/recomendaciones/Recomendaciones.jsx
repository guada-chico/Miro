
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, BookmarkPlus, ArrowLeft, X } from 'lucide-react';
import { getSpanishRecommendations } from '../../services/external-books-service';
import { toggleFavorite } from '../../services/favorites-service';
import { updateReadingStatus } from '../../services/reading-service';
import './Recomendaciones.css';

const GENRES = [
  { key: 'novela',           label: 'Novela' },
  { key: 'thriller',         label: 'Thriller' },
  { key: 'romance',          label: 'Romance' },
  { key: 'fantasia',         label: 'Fantasía' },
  { key: 'ciencia ficcion',  label: 'Ciencia ficción' },
  { key: 'historia',         label: 'Historia' },
  { key: 'biografia',        label: 'Biografía' },
  { key: 'autoayuda',        label: 'Autoayuda' },
];

export default function Recomendaciones() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('novela');

  useEffect(() => {
    setLoading(true);
    setBooks([]);
    getSpanishRecommendations(activeGenre)
      .then((data) => setBooks(data ?? []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [activeGenre]);

  const handleToggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    try { await toggleFavorite(bookId); } catch { /* silencioso */ }
  };

  const handleAddToLibrary = async (bookId) => {
    try {
      await updateReadingStatus(bookId, 'WantToRead', 0);
      setSelectedBook(null);
    } catch { /* silencioso */ }
  };

  return (
    <div className="reco-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Recomendaciones</h1>
        </div>
        <p>Libros actuales en español — powered by Google Books</p>
      </header>

      {/* Filtro de géneros */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {GENRES.map((g) => (
          <button
            key={g.key}
            onClick={() => setActiveGenre(g.key)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: 'none',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: activeGenre === g.key ? '#ff6b35' : '#f0f0f0',
              color: activeGenre === g.key ? 'white' : '#666',
              transition: 'all 0.2s',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Cargando libros en español...</p>
      ) : books.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>No se encontraron resultados para este género.</p>
      ) : (
        <div className="reco-grid">
          {books.map((book, i) => (
            <div key={book.isbn || book.id || i} className="reco-card" onClick={() => setSelectedBook(book)}>
              <div className="reco-img-wrapper">
                <img
                  src={book.imageUrl || 'https://via.placeholder.com/150x220?text=Sin+portada'}
                  alt={book.title}
                />
                <div className="reco-hover-actions">
                  <button className="reco-icon-btn" onClick={(e) => handleToggleFavorite(e, book.id)}>
                    <Heart size={18} />
                  </button>
                  <button className="reco-icon-btn" onClick={(e) => { e.stopPropagation(); handleAddToLibrary(book.id); }}>
                    <BookmarkPlus size={18} />
                  </button>
                </div>
              </div>
              <div className="reco-info">
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedBook(null)}>
              <X size={24} />
            </button>
            <div className="modal-body">
              <img
                src={selectedBook.imageUrl || 'https://via.placeholder.com/150x220?text=Sin+portada'}
                alt={selectedBook.title}
                className="modal-img"
              />
              <div className="modal-details">
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">de {selectedBook.author}</p>
                {selectedBook.category && (
                  <p style={{ fontSize: '0.8rem', color: '#ff6b35', marginBottom: '0.5rem' }}>
                    {selectedBook.category}
                  </p>
                )}
                <div className="modal-section">
                  <h3 className="modal-label">Sinopsis</h3>
                  <p className="modal-text">{selectedBook.synopsis || selectedBook.description || 'Sinopsis no disponible.'}</p>
                </div>
                <button className="add-to-library-btn" onClick={() => handleAddToLibrary(selectedBook.id)}>
                  Añadir a mi biblioteca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
