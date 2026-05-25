import { useState, useEffect } from 'react';
import { ExternalLink, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentReading } from '../../services/reading-service';
import { getSpanishRecommendations, getTopClassics } from '../../services/external-books-service';
import { useSettings } from '../../context/SettingsContext';
import { getT } from '../../i18n';
import './Inicio.css';

const GENRES = [
  { key: 'novela',          label: 'Novela' },
  { key: 'thriller',        label: 'Thriller' },
  { key: 'romance',         label: 'Romance' },
  { key: 'fantasia',        label: 'Fantasía' },
];

export default function Inicio() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const t = getT(settings.language).common;
  const [currentReading, setCurrentReading] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [classics, setClassics] = useState([]);
  const [activeGenre, setActiveGenre] = useState('novela');
  const [loadingReco, setLoadingReco] = useState(true);
  const [loadingClassics, setLoadingClassics] = useState(true);

  // Lectura actual y clásicos al montar
  useEffect(() => {
    getCurrentReading()
      .then(setCurrentReading)
      .catch(() => setCurrentReading(null));

    setLoadingClassics(true);
    getTopClassics(8)
      .then((data) => {
        setClassics(data ?? []);
        setLoadingClassics(false);
      })
      .catch((err) => {
        console.error('Error cargando clásicos:', err);
        setClassics([]);
        setLoadingClassics(false);
      });
  }, []);

  // Recomendaciones en español cuando cambia el género
  useEffect(() => {
    let cancelled = false;
    setLoadingReco(true);
    setRecommendations([]);
    getSpanishRecommendations(activeGenre)
      .then((data) => { if (!cancelled) setRecommendations(data ?? []); })
      .catch(() => { if (!cancelled) setRecommendations([]); })
      .finally(() => { if (!cancelled) setLoadingReco(false); });
    return () => { cancelled = true; };
  }, [activeGenre]);

  return (
    <div className="inicio-content">
      {/* SECCIÓN: CONTINUAR LEYENDO */}
      <section className="reading-now-section">
        <h1>Inicio</h1>
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
                    {Math.round((currentReading.currentPage / currentReading.book.totalPages) * 100)}% {t.completed}
                  </span>
                </div>
              )}
              <button className="continue-btn" onClick={() => navigate('/mis-libros')}>{t.continueReading}</button>
            </div>
          </div>
        ) : (
          <div className="reading-card">
            <p style={{ color: '#aaa', padding: '1rem' }}>{t.noActiveReading}</p>
          </div>
        )}
      </section>

      {/* SECCIÓN HERO Y BUSCADOR */}
      {/* Buscador removido */}

      {/* SECCIÓN: LIBROS RECOMENDADOS EN ESPAÑOL */}
      <section className="books-section">
        <div className="section-head">
          <h3>{t.recommendedInSpanish}</h3>
          <span
            className="orange-link"
            onClick={() => navigate('/recomendaciones')}
            style={{ cursor: 'pointer' }}
          >
            {t.viewAll} &gt;
          </span>
        </div>

        {/* Tabs de géneros */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {GENRES.map((g) => (
            <button
              key={g.key}
              onClick={() => setActiveGenre(g.key)}
              style={{
                padding: '0.35rem 0.9rem', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                background: activeGenre === g.key ? '#ff6b35' : '#f0f0f0',
                color: activeGenre === g.key ? 'white' : '#666',
                transition: 'all 0.2s',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {loadingReco ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem' }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{t.loading}</p>
          </div>
        ) : (
          <div className="books-grid">
            {recommendations.slice(0, 4).map((book, i) => (
              <div
                key={book.isbn || book.id || i}
                className="book-card"
                title={`${book.title}${book.author ? ` — ${book.author}` : ''}`}
              >
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '2/3', padding: '0.75rem', fontSize: '0.75rem', textAlign: 'center', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '20px' }}>
                    {book.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN: CLÁSICOS GRATUITOS (GUTENBERG) */}
      <section className="books-section">
        <div className="section-head">
          <h3>{t.freeClassics}</h3>
          <span
            className="orange-link"
            onClick={() => navigate('/clasicos')}
            style={{ cursor: 'pointer' }}
          >
            {t.viewAll} &gt;
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1rem' }}>
          {t.gutenbergCredit}
        </p>
        {loadingClassics ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem' }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{t.loading}</p>
          </div>
        ) : classics.length > 0 ? (
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
                  <div style={{ width: '100%', aspectRatio: '2/3', padding: '0.5rem', fontSize: '0.75rem', textAlign: 'center', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '20px' }}>
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
        ) : (
          <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No se encontraron clásicos en español</p>
        )}
      </section>
    </div>
  );
}
