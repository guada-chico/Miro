import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, ExternalLink, Download } from 'lucide-react';
import { searchGutendexBooks, getTopClassics } from '../../services/external-books-service';
import './Clasicos.css';

export default function Clasicos() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Cargar los clásicos más populares al inicio
    getTopClassics(32)
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchGutendexBooks(searchQuery);
      setBooks(results);
    } catch {
      setBooks([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReadBook = (url) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="clasicos-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Clásicos Gratuitos</h1>
        </div>
        <p>Más de 70,000 libros clásicos para leer gratis — Cortesía de Project Gutenberg</p>
      </header>

      {/* Buscador */}
      <form className="search-bar-clasicos" onSubmit={handleSearch}>
        <Search size={20} color="#bbb" />
        <input
          type="text"
          placeholder="Buscar por título, autor (ej: Shakespeare, Cervantes, Austen)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa', marginTop: '2rem' }}>
          Cargando clásicos...
        </p>
      ) : (
        <div className="clasicos-grid">
          {books.map((book) => (
            <div key={book.id} className="clasico-card">
              <div className="clasico-cover">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} />
                ) : (
                  <div className="no-cover">
                    <BookOpen size={32} color="#ccc" />
                  </div>
                )}
              </div>
              
              <div className="clasico-info">
                <h4>{book.title}</h4>
                <p className="clasico-author">
                  {book.authors.length > 0 ? book.authors.join(', ') : 'Autor desconocido'}
                </p>
                
                <div className="clasico-meta">
                  <span className="clasico-lang">
                    {book.languages.includes('es') ? '🇪🇸 Español' : 
                     book.languages.includes('en') ? '🇬🇧 Inglés' : 
                     book.languages[0]?.toUpperCase() || 'N/A'}
                  </span>
                  <span className="clasico-downloads">
                    <Download size={12} /> {book.downloadCount.toLocaleString()}
                  </span>
                </div>

                {book.readUrl && (
                  <button 
                    className="read-now-btn"
                    onClick={() => handleReadBook(book.readUrl)}
                  >
                    <ExternalLink size={16} />
                    Leer ahora
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && books.length === 0 && (
        <div style={{ textAlign: 'center', color: '#aaa', marginTop: '3rem' }}>
          <BookOpen size={48} color="#ddd" />
          <p style={{ marginTop: '1rem' }}>
            No se encontraron resultados. Intenta con otro término de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
