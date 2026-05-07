import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, BookmarkPlus, ArrowLeft, X } from 'lucide-react';
import { getMyRecommendations } from '../../services/recommendations-service';
import { toggleFavorite } from '../../services/favorites-service';
import { updateReadingStatus } from '../../services/reading-service';
import './Recomendaciones.css';

export default function Recomendaciones() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRecommendations()
      .then((data) => {
        if (data && data.length > 0) {
          // El backend devuelve campo "imageUrl" (no coverImageUrl)
          setBooks(data);
        } else {
          // Sin favoritos → cargar populares de Gutenberg como fallback
          import('../../services/external-books-service').then(({ getTopClassics }) => {
            getTopClassics(20).then((classics) => {
              const normalized = classics.map((b) => ({
                id: b.id,
                title: b.title,
                author: b.authors?.[0] ?? 'Autor desconocido',
                imageUrl: b.coverUrl,
                description: null,
                readUrl: b.readUrl,
              }));
              setBooks(normalized);
            });
          });
        }
      })
      .catch(() => {
        import('../../services/external-books-service').then(({ getTopClassics }) => {
          getTopClassics(20).then((classics) => {
            const normalized = classics.map((b) => ({
              id: b.id,
              title: b.title,
              author: b.authors?.[0] ?? 'Autor desconocido',
              imageUrl: b.coverUrl,
              description: null,
              readUrl: b.readUrl,
            }));
            setBooks(normalized);
          }).catch(() => setBooks([]));
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    try {
      await toggleFavorite(bookId);
    } catch {
      // silencioso
    }
  };

  const handleAddToLibrary = async (bookId) => {
    try {
      await updateReadingStatus(bookId, 'WantToRead', 0);
      setSelectedBook(null);
    } catch {
      // silencioso
    }
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
        <p>Libros seleccionados especialmente para ti</p>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Cargando recomendaciones...</p>
      ) : (
        <div className="reco-grid">
          {books.map((book) => (
            <div key={book.id} className="reco-card" onClick={() => setSelectedBook(book)}>
              <div className="reco-img-wrapper">
                <img src={book.imageUrl || book.coverImageUrl || 'https://via.placeholder.com/150x220?text=Sin+portada'} alt={book.title} />
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
                <div className="reco-rating">
                  <Star size={14} fill="#ff6b35" color="#ff6b35" />
                  <span>{book.rating || 'N/A'}</span>
                </div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedBook(null)}>
              <X size={24} />
            </button>
            
            <div className="modal-body">
              <img src={selectedBook.imageUrl || selectedBook.coverImageUrl || 'https://via.placeholder.com/150x220?text=Sin+portada'} alt={selectedBook.title} className="modal-img" />
              <div className="modal-details">
                <div className="reco-rating">
                  <Star size={18} fill="#ff6b35" color="#ff6b35" />
                  <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{selectedBook.rating || 'N/A'}</span>
                </div>
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">{selectedBook.author}</p>
                
                <div className="modal-section">
                  <h3 className="modal-label">Sinopsis</h3>
                  <p className="modal-text">{selectedBook.description || "Sinopsis no disponible."}</p>
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