import { useState, useEffect } from 'react';
import { Search, ChevronDown, BookOpen, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentReading } from '../../services/reading-service';
import { getMyRecommendations } from '../../services/recommendations-service';
import { searchExternalBooks, getTopClassics } from '../../services/external-books-service';
import './Inicio.css';

export default function Inicio() {
  const navigate = useNavigate();
  const [currentReading, setCurrentReading] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [classics, setClassics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getCurrentReading()
      .then(setCurrentReading)
      .catch(() => setCurrentReading(null));

    // Intentar recomendaciones del backend; si vienen vacías o falla,
    // usar los clásicos populares de Gutenberg como fallback
    getMyRecommendations()
      .then((data) => {
        if (data && data.length > 0) {
          setRecommendations(data);
        } else {
          // Sin favoritos aún → mostrar populares de Gutenberg
          return getTopClassics(8).then((classics) => {
            // Normalizar al mismo formato que usa el template
            const normalized = classics.map((b) => ({
              id: b.id,
              title: b.title,
              imageUrl: b.coverUrl,
              author: b.authors?.[0] ?? 'Autor desconocido',
              readUrl: b.readUrl,
            }));
            setRecommendations(normalized);
          });
        }
      })
      .catch(() => {
        // Si falla la autenticación, cargar Gutenberg directamente
        getTopClassics(8)
          .then((classics) => {
            const normalized = classics.map((b) => ({
              id: b.id,
              title: b.title,
              imageUrl: b.coverUrl,
              author: b.authors?.[0] ?? 'Autor desconocido',
              readUrl: b.readUrl,
            }));
            setRecommendations(normalized);
          })
          .catch(() => setRecommendations([]));
      });

    // Clásicos de la sección inferior (diferente selección)
    getTopClassics(8)
      .then(setClassics)
      .catch(() => setClassics([]));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    try {
      const results = await searchExternalBooks(searchQuery);
      if (results.length === 0) {
        setSearchError('No se encontraron resultados. Prueba con otro término.');
      }
      setSearchResults(results);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setSearchError('Error al buscar. Comprueba que el backend está activo.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="inicio-content">
{/* SECCIÓN: CONTINUAR LEYENDO */}
      <section className="reading-now-section">
        <h1>Inicio</h1>
        <div className="section-head">
          <h3>Continuar leyendo</h3>
        </div>
        {currentReading ? (
          <div className="reading-card">
            <div className="reading-cover-container">
              <img
                src={currentReading.book?.imageUrl || currentReading.book?.coverImageUrl || 'https://via.placeholder.com/120x180?text=Sin+portada'}
                alt={currentReading.book?.title}
                className="reading-cover"
              />
            </div>
            <div className="reading-info">
              <h4>{currentReading.book?.title}</h4>
              <p className="author">{currentReading.book?.author}</p>
              {currentReading.book?.totalPages > 0 && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.round((currentReading.currentPage / currentReading.book.totalPages) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round((currentReading.currentPage / currentReading.book.totalPages) * 100)}% completado
                  </span>
                </div>
              )}
              <button className="continue-btn" onClick={() => navigate('/mis-libros')}>Continuar</button>
            </div>
          </div>
        ) : (
          <div className="reading-card">
            <p style={{ color: '#aaa', padding: '1rem' }}>No tienes ninguna lectura activa. ¡Añade un libro a tu biblioteca!</p>
          </div>
        )}
      </section>

      {/* SECCIÓN HERO Y BUSCADOR */}
      <section className="hero">
        <form className="search-capsule" onSubmit={handleSearch}>
          <div className="search-cat">
            Todas las categorías <ChevronDown size={14} />
          </div>
          <div className="search-input">
            <Search size={18} color="#999" />
            <input
              type="text"
              placeholder="Encuentra el libro que quieres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="search-btn" type="submit" disabled={isSearching}>
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Resultados de búsqueda */}
        {searchError && (
          <p style={{ marginTop: '1rem', color: '#e55a25', fontSize: '0.9rem' }}>{searchError}</p>
        )}
        {searchResults.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#555' }}>
              {searchResults.length} resultados para "{searchQuery}"
            </h3>
            <div className="books-grid">
              {searchResults.map((book, i) => (
                <div key={book.isbn || book.id || i} className="book-card" title={`${book.title} — ${book.author}`}>
                  {book.imageUrl
                    ? <img src={book.imageUrl} alt={book.title} />
                    : (
                      <div style={{ padding: '0.75rem', fontSize: '0.75rem', textAlign: 'center', color: '#888', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {book.title}
                      </div>
                    )
                  }
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN: LIBROS RECOMENDADOS */}
      <section className="books-section">
        <div className="section-head">
          <h3>Libros recomendados</h3>
          <span
            className="orange-link"
            onClick={() => navigate('/recomendaciones')}
            style={{ cursor: 'pointer' }}
          >
            Ver todos &gt;
          </span>
        </div>
        <div className="books-grid">
          {recommendations.slice(0, 4).map((book) => (
            <div
              key={book.id}
              className="book-card"
              style={{ cursor: book.readUrl ? 'pointer' : 'default' }}
              onClick={() => book.readUrl && window.open(book.readUrl, '_blank')}
              title={`${book.title}${book.author ? ` — ${book.author}` : ''}`}
            >
              {book.imageUrl
                ? <img src={book.imageUrl} alt={book.title} />
                : (
                  <div style={{ padding: '0.75rem', fontSize: '0.75rem', textAlign: 'center', color: '#888', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {book.title}
                  </div>
                )
              }
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: CLÁSICOS GRATUITOS (GUTENBERG) */}
      <section className="books-section">
        <div className="section-head">
          <h3>Clásicos para leer gratis</h3>
          <span style={{ fontSize: '0.85rem', color: '#999' }}>
            Cortesía de Project Gutenberg
          </span>
        </div>
        <div className="books-grid">
          {classics.map((book) => (
            <div
              key={book.id}
              className="book-card"
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => book.readUrl && window.open(book.readUrl, '_blank')}
              title={`${book.title} — ${book.authors.join(', ')}`}
            >
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} />
              ) : (
                <div style={{ padding: '0.5rem', fontSize: '0.75rem', textAlign: 'center', color: '#888' }}>
                  {book.title}
                </div>
              )}
              {book.readUrl && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ff6b35',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ExternalLink size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}