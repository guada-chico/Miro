import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, ExternalLink } from 'lucide-react';
import { getSpanishClassics, searchExternalBooks } from '../../services/external-books-service';
import { useSettings } from '../../context/SettingsContext';
import { getT } from '../../i18n';
import './Clasicos.css';

export default function Clasicos() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const t = getT(settings.language);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getSpanishClassics()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchExternalBooks(searchQuery);
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
          <h1>{t.clasicos.title}</h1>
        </div>
        <p>{t.clasicos.subtitle}</p>
      </header>

      {/* Buscador */}
      <form className="search-bar-clasicos" onSubmit={handleSearch}>
        <Search size={20} color="#bbb" />
        <input
          type="text"
          placeholder={t.clasicos.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? t.clasicos.searching : t.clasicos.search}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa', marginTop: '2rem' }}>
          {t.clasicos.loadingClassics}
        </p>
      ) : (
        <div className="clasicos-grid">
          {books.map((book, i) => (
            <div key={book.isbn || book.id || i} className="clasico-card">
              <div className="clasico-cover">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} />
                ) : (
                  <div className="no-cover">
                    <BookOpen size={32} color="#ccc" />
                  </div>
                )}
              </div>
              
              <div className="clasico-info">
                <h4>{book.title}</h4>
                <p className="clasico-author">{book.author}</p>
                {book.category && (
                  <div className="clasico-meta">
                    <span className="clasico-lang">
                      {book.category}
                    </span>
                  </div>
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
            {t.clasicos.noResults}
          </p>
        </div>
      )}
    </div>
  );
}
