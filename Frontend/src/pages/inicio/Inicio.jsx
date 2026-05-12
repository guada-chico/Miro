import { useState, useEffect } from 'react';
import { Search, ChevronDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentReading } from '../../services/reading-service';
import { searchExternalBooks, getOpenLibraryRecommendations, getSpanishClassicsGutenberg } from '../../services/external-books-service';
import { useSettings } from '../../context/SettingsContext';
import { getT } from '../../i18n';
import './Inicio.css';

export default function Inicio() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const t = getT(settings.language).home;

  const GENRES = [
    { key: 'novela',   label: t.genres.novela },
    { key: 'thriller', label: t.genres.thriller },
    { key: 'romance',  label: t.genres.romance },
    { key: 'fantasia', label: t.genres.fantasia },
  ];

  const [currentReading, setCurrentReading] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [classics, setClassics] = useState([]);
  const [activeGenre, setActiveGenre] = useState('novela');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadingReco, setLoadingReco] = useState(true);

  useEffect(() => {
    getCurrentReading()
      .then(setCurrentReading)
      .catch(() => setCurrentReading(null));

    getSpanishClassicsGutenberg(8)
      .then(setClassics)
      .catch(() => setClassics([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingReco(true);
    getOpenLibraryRecommendations(activeGenre)
      .then((data) => { if (!cancelled) setRecommendations(data ?? []); })
      .catch(() => { if (!cancelled) setRecommendations([]); })
      .finally(() => { if (!cancelled) setLoadingReco(false); });
    return () => { cancelled = true; };
  }, [activeGenre]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    try {
      const results = await searchExternalBooks(searchQuery);
      if (results.length === 0) setSearchError(t.noResults);
      setSearchResults(results);
    } catch {
      setSearchError(t.searchError);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="inicio-content">
      {/* CONTINUAR LEYENDO */}
      <section className="reading-now-section">
        <h1>{t.title}</h1>
        <div className="section-head">
          <h3>{t.continueReading}</h3>
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
                    {Math.round((currentReading.currentPage / currentReading.book.totalPages) * 100)}{t.completed}
                  </span>
                </div>
              )}
              <button className="continue-btn" onClick={() => navigate('/mis-libros')}>{t.continue}</button>
            </div>
          </div>
        ) : (
          <div className="reading-card">
            <p style={{ color: '#aaa', padding: '1rem' }}>{t.noActiveReading}</p>
          </div>
        )}
      </section>

      {/* BUSCADOR */}
      <section className="hero">
        <form className="search-capsule" onSubmit={handleSearch}>
          <div className="search-cat">
            {t.allCategories} <ChevronDown size={14} />
          </div>
          <div className="search-input">
            <Search size={18} color="#999" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="search-btn" type="submit" disabled={isSearching}>
            {isSearching ? t.searching : t.search}
          </button>
        </form>

        {searchError && (
          <p style={{ marginTop: '1rem', color: '#e55a25', fontSize: '0.9rem' }}>{searchError}</p>
        )}
        {searchResults.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#555' }}>
              {searchResults.length} {t.resultsFor} "{searchQuery}"
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

      {/* RECOMENDADOS */}
      <section className="books-section">
        <div className="section-head">
          <h3>{t.recommendedInSpanish}</h3>
          <span className="orange-link" onClick={() => navigate('/recomendaciones')} style={{ cursor: 'pointer' }}>
            {t.viewAll}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {GENRES.map((g) => (
            <button
              key={g.key}
              onClick={() => setActiveGenre(g.key)}
              style={{
                padding: '0.35rem 0.9rem', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                background: activeGenre === g.key ? '#ff6b35' : 'var(--color-bg-input)',
                color: activeGenre === g.key ? 'white' : 'var(--color-text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {loadingReco ? (
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{t.loadingBooks}</p>
        ) : (
          <div className="books-grid">
            {recommendations.slice(0, 4).map((book, i) => (
              <div key={book.isbn || book.id || i} className="book-card" title={`${book.title}${book.author ? ` — ${book.author}` : ''}`}>
                {(book.coverUrl || book.imageUrl) ? (
                  <img src={book.coverUrl || book.imageUrl} alt={book.title} />
                ) : (
                  <div style={{ padding: '0.75rem', fontSize: '0.75rem', textAlign: 'center', color: '#888', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {book.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CLÁSICOS GRATUITOS */}
      <section className="books-section">
        <div className="section-head">
          <h3>{t.freeClassics}</h3>
          <span style={{ fontSize: '0.85rem', color: '#999' }}>{t.gutenbergCredit}</span>
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
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#ff6b35', color: 'white', borderRadius: '50%', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
