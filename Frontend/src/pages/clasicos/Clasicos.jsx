import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, ExternalLink } from 'lucide-react';
import { getSpanishClassicsGutenberg, searchSpanishClassics } from '../../services/external-books-service';
import './Clasicos.css';

export default function Clasicos() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getSpanishClassicsGutenberg(32)
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchSpanishClassics(searchQuery);
      setBooks(results);
    } catch {
      setBooks([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="clasicos-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Clásicos en Español</h1>
        </div>
        <p>Literatura clásica en español — gratis en Project Gutenberg</p>
      </header>

      <form className="search-bar-clasicos" onSubmit={handleSearch}>
        <Search size={20} color="#bbb" />
        <input
          type="text"
          placeholder="Buscar por título o autor (ej: Cervantes, Galdós, Lorca)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa', marginTop: '2rem' }}>Cargando clásicos...</p>
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
                  {book.authors?.length > 0 ? book.authors.join(', ') : 'Autor desconocido'}
                </p>
                <div className="clasico-meta">
                  <span className="clasico-lang">🇪🇸 Español</span>
                  {book.downloadCount > 0 && (
                    <span className="clasico-downloads">
                      ↓ {book.downloadCount.toLocaleString()}
                    </span>
                  )}
                </div>
                {book.readUrl && (
                  <button
                    className="read-now-btn"
                    onClick={() => window.open(book.readUrl, '_blank')}
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
          <p style={{ marginTop: '1rem' }}>No se encontraron resultados.</p>
        </div>
      )}
    </div>
  );
}
